import React from "react";
import { Link } from "react-router-dom";
import { SERVICES_TWO_LIST } from "../../mocks/services";
import { ServicesTwoItem } from "./ServicesTwoItem";

export const ServicesTwo = () => {
  return (
    <section className="services-area-two services-bg-two">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-8">
            <div className="section-title-two mb-60 tg-heading-subheading animation-style3">
              <span className="sub-title">What We Do For You</span>
              <h2 className="title tg-element-title">
                We can inspire and Offer Different Services
              </h2>
            </div>
          </div>
          <div className="col-lg-6 col-md-4">
            <div className="view-all-btn text-end mb-30">
              <Link to="/services" className="btn">
                See All Service
              </Link>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {SERVICES_TWO_LIST.map((service) => (
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
