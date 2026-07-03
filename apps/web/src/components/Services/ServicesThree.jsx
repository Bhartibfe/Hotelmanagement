import React from "react";
import { Link } from "react-router-dom";
import { H4_SERVICES_SHAPE } from "../../lib/assets";
import { SERVICES_THREE_LIST } from "../../mocks/services";
import { ServicesThreeItem } from "./ServicesThreeItem";

export const ServicesThree = ({ isServicePage }) => {
  const list = !isServicePage
    ? SERVICES_THREE_LIST
    : [...SERVICES_THREE_LIST, ...SERVICES_THREE_LIST];

  return (
    <section className="services-area-three">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <div className="section-title-two mb-50 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">
                Our Expertise Areas
              </span>
              <h2 className="title tg-element-title">
                We Make Better Insurance For Everyone
              </h2>
            </div>
          </div>
          <div className="col-xl-7 col-lg-6 col-md-4">
            <div className="view-all-btn text-end mb-30">
              <Link to="/services" className="btn transparent-btn-two">
                See All Service
              </Link>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {list.map((service) => (
            <div
              key={service.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-10"
            >
              <ServicesThreeItem service={service} />
            </div>
          ))}
        </div>
      </div>

      <div className="services-shape-four">
        <img
          src={H4_SERVICES_SHAPE}
          alt=""
          data-aos="fade-left"
          data-aos-delay="200"
        />
      </div>
    </section>
  );
};
