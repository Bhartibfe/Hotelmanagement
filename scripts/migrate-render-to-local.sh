#!/usr/bin/env bash
#
# Copy the Render (production) database down to the local Postgres instance.
#
#   Source: the hosted database named by SRC_DB_URL (read-only — never written)
#   Target: the local database named by TGT_DB_URL (DROPPED AND RECREATED)
#
# The target is destroyed and rebuilt, so the order below matters: the dump is
# taken and verified FIRST, and the local database is only dropped once a good
# dump exists on disk. If the dump fails, the local database is left untouched.
#
# Credentials are never written into this file. Supply them at run time:
#
#   SRC_DB_URL='postgresql://USER:PASS@HOST/DB?sslmode=require' \
#   TGT_DB_URL='postgresql://postgres:PASS@localhost:5432/hotel_network_db' \
#   bash scripts/migrate-render-to-local.sh
#
# TGT_DB_URL defaults to whatever DATABASE_URL is in the repo-root .env.
#
# NOTE: the dump contains real member PII (names, emails, phone numbers).
# It is written to ./.dbdump/ , which is gitignored. Delete it when done.

set -euo pipefail

PGBIN="${PGBIN:-/c/Program Files/PostgreSQL/18/bin}"
DUMP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/.dbdump"
DUMP_FILE="$DUMP_DIR/render-$(date +%Y%m%d-%H%M%S).dump"

for tool in pg_dump pg_restore psql dropdb createdb; do
  [ -x "$PGBIN/$tool" ] || { echo "FATAL: $tool not found in $PGBIN" >&2; exit 1; }
done

# Fall back to the .env DATABASE_URL for the target, url-decoding the password.
if [ -z "${TGT_DB_URL:-}" ]; then
  TGT_DB_URL=$(python -c "
import io,urllib.parse
l=[x for x in io.open('.env',encoding='utf-8') if x.startswith('DATABASE_URL')][0].strip()
u=urllib.parse.urlparse(l.split('=',1)[1].strip().strip('\"').strip(\"'\"))
pw=urllib.parse.unquote(u.password or '')
print(f'postgresql://{u.username}:{pw}@{u.hostname}:{u.port or 5432}{u.path}', end='')
")
fi
: "${SRC_DB_URL:?set SRC_DB_URL to the Render connection string}"

TGT_DB=$(python -c "import urllib.parse,os;print(urllib.parse.urlparse(os.environ['TGT_DB_URL']).path.lstrip('/'))" TGT_DB_URL="$TGT_DB_URL")
TGT_ADMIN=$(python -c "
import urllib.parse,os
u=urllib.parse.urlparse(os.environ['TGT_DB_URL'])
print(f'postgresql://{u.username}:{u.password}@{u.hostname}:{u.port or 5432}/postgres', end='')
")
export TGT_DB_URL

say(){ printf '\n\033[1m== %s\033[0m\n' "$*"; }

# ---------------------------------------------------------------- 1. inspect
say "1/6  Source (Render) — reachability and size"
"$PGBIN/psql" "$SRC_DB_URL" -tAc "select version()" | head -1
SRC_COUNTS=$("$PGBIN/psql" "$SRC_DB_URL" -tAF'|' -c "
  select table_name,
         (xpath('/row/c/text()',
                query_to_xml(format('select count(*) as c from %I.%I','public',table_name),
                             false,true,'')))[1]::text::bigint as n
  from information_schema.tables
  where table_schema='public' and table_type='BASE TABLE'
  order by table_name")
echo "$SRC_COUNTS" | awk -F'|' '$2>0 {printf "   %-22s %s\n",$1,$2}'
SRC_TOTAL=$(echo "$SRC_COUNTS" | awk -F'|' '{s+=$2} END{print s+0}')
echo "   source total rows: $SRC_TOTAL"
[ "$SRC_TOTAL" -gt 0 ] || { echo "FATAL: source has no rows — refusing to wipe the target." >&2; exit 1; }

# ------------------------------------------------------------------- 2. dump
say "2/6  Dumping source  ->  $DUMP_FILE"
mkdir -p "$DUMP_DIR"
"$PGBIN/pg_dump" "$SRC_DB_URL" --format=custom --no-owner --no-privileges --verbose \
  --file="$DUMP_FILE" 2> "$DUMP_FILE.log" || { echo "FATAL: pg_dump failed, see $DUMP_FILE.log" >&2; exit 1; }

# ----------------------------------------------------------------- 3. verify
say "3/6  Verifying the dump is readable before touching anything local"
TABLES_IN_DUMP=$("$PGBIN/pg_restore" --list "$DUMP_FILE" | grep -c 'TABLE DATA' || true)
echo "   dump size:            $(du -h "$DUMP_FILE" | cut -f1)"
echo "   tables with data:     $TABLES_IN_DUMP"
[ "$TABLES_IN_DUMP" -gt 0 ] || { echo "FATAL: dump contains no table data — aborting." >&2; exit 1; }

# ------------------------------------------------- 4. drop + recreate target
say "4/6  Recreating local database '$TGT_DB'  (DESTRUCTIVE)"
"$PGBIN/psql" "$TGT_ADMIN" -q -c \
  "select pg_terminate_backend(pid) from pg_stat_activity where datname='$TGT_DB' and pid<>pg_backend_pid()" >/dev/null
"$PGBIN/dropdb"   "$(python -c "
import urllib.parse,os;u=urllib.parse.urlparse(os.environ['TGT_DB_URL'])
print(f'--host={u.hostname} --port={u.port or 5432} --username={u.username}')" )" --if-exists "$TGT_DB" 2>/dev/null \
  || "$PGBIN/psql" "$TGT_ADMIN" -q -c "drop database if exists \"$TGT_DB\""
"$PGBIN/psql" "$TGT_ADMIN" -q -c "create database \"$TGT_DB\""
echo "   recreated empty."

# ---------------------------------------------------------------- 5. restore
say "5/6  Restoring into '$TGT_DB'"
"$PGBIN/pg_restore" --dbname="$TGT_DB_URL" --no-owner --no-privileges \
  --exit-on-error "$DUMP_FILE" 2>&1 | tail -5
echo "   restore finished."

# ----------------------------------------------------------------- 6. compare
say "6/6  Row-count comparison  (source vs target)"
TGT_COUNTS=$("$PGBIN/psql" "$TGT_DB_URL" -tAF'|' -c "
  select table_name,
         (xpath('/row/c/text()',
                query_to_xml(format('select count(*) as c from %I.%I','public',table_name),
                             false,true,'')))[1]::text::bigint as n
  from information_schema.tables
  where table_schema='public' and table_type='BASE TABLE'
  order by table_name")

MISMATCH=0
printf "   %-22s %8s %8s\n" TABLE SOURCE TARGET
while IFS='|' read -r t n; do
  [ -z "$t" ] && continue
  m=$(echo "$TGT_COUNTS" | awk -F'|' -v k="$t" '$1==k{print $2}')
  m=${m:-MISSING}
  if [ "$n" != "$m" ]; then MISMATCH=1; flag="  <-- MISMATCH"; else flag=""; fi
  [ "$n" != "0" ] || [ "$m" != "0" ] && printf "   %-22s %8s %8s%s\n" "$t" "$n" "$m" "$flag"
done <<< "$SRC_COUNTS"

echo
if [ "$MISMATCH" -eq 0 ]; then
  echo "SUCCESS — every table matches. Local is now a copy of Render."
  echo "Reminder: $DUMP_FILE contains member PII. Delete it when you no longer need it."
else
  echo "FINISHED WITH MISMATCHES — review the table above before trusting this data." >&2
  exit 1
fi
