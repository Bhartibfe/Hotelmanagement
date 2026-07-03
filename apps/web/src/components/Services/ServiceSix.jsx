import React from "react";
import { SERVICES_TWO_LIST } from "../../mocks/services";
import { ServicesTwoItem } from "./ServicesTwoItem";

export const ServiceSix = () => {
  return (
    <section className="services-area-six">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="section-title-two mb-60">
              <span className="sub-title">What We Do For You</span>
              <h2 className="title">
                We can inspire and Offer Different Services
              </h2>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="section-top-content mb-30">
              <p>
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor amet, consectetuolor sit amet, consectetur adipiscing
                elita florai psum sit amet consecteturere.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {[...SERVICES_TWO_LIST, ...SERVICES_TWO_LIST].map((service) => (
            <div
              key={service.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-8"
            >
              <ServicesTwoItem service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
