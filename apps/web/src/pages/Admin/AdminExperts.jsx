import React from "react";
import ExpertDirectoryAdmin from "../../components/admin/ExpertDirectoryAdmin";

// Experts can also self-register at /register/expert; this screen is the admin
// side of the same directory. See AdminAdvisory for the invitation-only half.
const COPY = {
  heading: "Industry Experts",
  subheading: "Manage industry experts and thought leaders",
  addButton: "Add Expert",
  dialogCreateTitle: "Create Expert Account",
  dialogEditTitle: "Edit Expert",
  emailPlaceholder: "expert@example.com",
  photoLabel: "Expert Photo",
  visibilityHeading: "Homepage Visibility",
  starredHint: "Eligible to appear on homepage",
  pinnedHint: "Always shown on homepage",
  pinTitle: "Pin to homepage (always shown)",
  unpinTitle: "Unpin from homepage",
  starTitle: "Star (eligible for homepage)",
  submitCreate: "Create Expert",
  saveError: "Failed to save expert",
  deleteConfirm: "Are you sure you want to remove this expert?",
  searchPlaceholder: "Search experts...",
  emptyIcon: "fas fa-user-tie",
  emptyTitle: "No experts found",
  emptyHint: 'Click "Add Expert" to create one.',
};

const AdminExperts = () => <ExpertDirectoryAdmin kind="EXPERT" copy={COPY} />;

export default AdminExperts;
