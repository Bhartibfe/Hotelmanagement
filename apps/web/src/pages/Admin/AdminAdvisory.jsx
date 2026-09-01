import React from "react";
import ExpertDirectoryAdmin from "../../components/admin/ExpertDirectoryAdmin";

// Advisory board members have no public sign-up route — this screen is the only
// way one is created. Same form and same record as AdminExperts, different
// directory. Starred/pinned order the /advisory listing rather than a homepage
// section, since advisory members are not shown on the homepage.
const COPY = {
  heading: "Advisory Board",
  subheading: "Appoint and manage advisory board members — added by admin only",
  addButton: "Add Advisory Member",
  dialogCreateTitle: "Create Advisory Member Account",
  dialogEditTitle: "Edit Advisory Member",
  emailPlaceholder: "advisor@example.com",
  photoLabel: "Advisory Member Photo",
  visibilityHeading: "Directory Placement",
  starredHint: "Highlighted in the advisory listing",
  pinnedHint: "Always listed first",
  pinTitle: "Pin to the top of the advisory listing",
  unpinTitle: "Unpin from the top of the listing",
  starTitle: "Star (highlight in the listing)",
  submitCreate: "Create Advisory Member",
  saveError: "Failed to save advisory member",
  deleteConfirm: "Are you sure you want to remove this advisory member?",
  searchPlaceholder: "Search advisory members...",
  emptyIcon: "fas fa-user-shield",
  emptyTitle: "No advisory members yet",
  emptyHint: 'Click "Add Advisory Member" to appoint one.',
};

const AdminAdvisory = () => <ExpertDirectoryAdmin kind="ADVISORY" copy={COPY} />;

export default AdminAdvisory;
