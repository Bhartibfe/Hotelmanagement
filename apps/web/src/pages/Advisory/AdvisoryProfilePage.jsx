import React from "react";
import ExpertProfileView from "../../components/profile/ExpertProfileView";
import api from "../../services/api";

// No joinPath: advisory members are appointed from the admin panel, so the
// closing CTA offers only the way back to the directory.
const COPY = {
  fetch: (id) => api.getAdvisoryMember(id),
  breadcrumb: "Advisory",
  pageTitle: "Advisory Board Member",
  loadingText: "Loading advisory profile...",
  notFoundError: "Advisory profile not found.",
  notFoundTitle: "Advisory Member Not Found",
  notFoundBody: "The advisory profile you are looking for does not exist in our directory.",
  directoryPath: "/advisory",
  backToDirectory: "Back to Advisory Board",
  fallbackName: "Advisory Board Member",
  heroBadge: "Advisory Board",
  contactButton: "Contact Advisor",
  ctaBody: "Our advisory board guides the direction of the network. Reach out to start a conversation.",
  joinPath: null,
  joinLabel: null,
  allLabel: "All Advisory Members",
};

const AdvisoryProfilePage = () => <ExpertProfileView copy={COPY} />;

export default AdvisoryProfilePage;
