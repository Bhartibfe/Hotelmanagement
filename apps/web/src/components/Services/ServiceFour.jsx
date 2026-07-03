import React from "react";
import { SERVICES_FOUR_LIST } from "../../mocks/services";
import { ServiceFourItem } from "./ServiceFourItem";
import cn from "classnames";

export const ServiceFour = ({ className, isServicePage }) => {
  const list = !isServicePage
    ? SERVICES_FOUR_LIST
    : [...SERVICES_FOUR_LIST, ...SERVICES_FOUR_LIST];

  return (
    <section className={cn("services-area-four", className)}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title section-title-three text-center mb-60 tg-heading-subheading animation-style1">
              <span className="sub-title tg-element-title">Our Expertise</span>
              <h2 className="title tg-element-title">Provide Best Services</h2>
              <p>
                Morem ipsum dolor sit amet consectetur adipiscingelita florai
                psumBoremipsum dolor sit amet.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {list.map((service) => (
            <div key={service.id} className="col-lg-4 col-md-6">
              <ServiceFourItem service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
