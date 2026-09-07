/*=============================
  Name search
  -----------------------------
  Every directory on the site — Experts, Advisory, Owners, Partners,
  Marketplace — searches the same way: by who someone is, not by what their
  profile says.

  The listings used to match the free text of a bio or a company description
  too, so typing "hotel" returned half the directory because the word happened
  to appear in somebody's write-up. Facets that belong in a filter (expertise,
  city, category) have their own controls next to the box and are deliberately
  left out here.
===============================*/

// The name fields a record can be found by: the person's own name and the
// organisation or company they are listed under.
export const nameSearchFields = (record = {}) => {
  const user = record.user || {};
  const personName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`
      : record.name || `${record.firstName || ""} ${record.lastName || ""}`;

  return [
    personName,
    user.organizationName,
    record.organizationName,
    record.companyName,
    record.company,
  ];
};

// True when the record has no name to hide behind the term. An empty term
// matches everything, so the box starts out showing the whole directory.
export const matchesNameSearch = (record, term) => {
  const needle = (term || "").trim().toLowerCase();
  if (!needle) return true;
  return nameSearchFields(record).some(
    (field) => field && String(field).toLowerCase().includes(needle)
  );
};
