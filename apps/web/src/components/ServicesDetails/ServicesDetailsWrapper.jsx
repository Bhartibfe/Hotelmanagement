import React from "react";
import { ServicesDetailsSidebar } from "./ServicesDetailsSidebar";

export const ServicesDetailsWrapper = ({
  children,
  hideContact = false,
  hideTitle = false,
}) => {
  return (
    <section className="services-details-area pt-120 pb-120">
      <div className="container">
        <div className="row justify-content-center">
          {/* content */}
          <div className="col-71 order-0 order-lg-2">{children}</div>

          {/* sidebar */}
          <div className="col-29">
            <ServicesDetailsSidebar
              hideTitle={hideTitle}
              hideContact={hideContact}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
