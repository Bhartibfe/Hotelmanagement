import React from "react";
import ExpertProfileView from "../../components/profile/ExpertProfileView";
import api from "../../services/api";

const COPY = {
  fetch: (id) => api.getExpert(id),
  breadcrumb: "Experts",
  pageTitle: "Expert Profile",
  loadingText: "Loading expert profile...",
  notFoundError: "Expert profile not found.",
  notFoundTitle: "Expert Not Found",
  notFoundBody: "The expert profile you are looking for does not exist in our directory.",
  directoryPath: "/experts",
  backToDirectory: "Back to Experts Directory",
  fallbackName: "Industry Expert",
  heroBadge: "Verified Industry Expert",
  contactButton: "Contact Expert",
  ctaBody: "Join our hospitality network to connect with verified industry experts and consultants.",
  joinPath: "/register/expert",
  joinLabel: "Join as Expert",
  allLabel: "All Experts",
};

const ExpertProfilePage = () => <ExpertProfileView copy={COPY} />;

export default ExpertProfilePage;
