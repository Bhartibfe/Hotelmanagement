-- Split out from 20260929_add_user_slug so a duplicate in the backfilled data
-- could never mark that migration failed and block the migration history.
--
-- Postgres allows many NULLs under a unique index, so this constrains only
-- populated values: a row inserted by hand with no slug stays legal and falls
-- back to its id URL.
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");
