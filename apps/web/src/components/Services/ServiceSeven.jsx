import React from "react";
import { FEATURE_THREE_LIST } from "../../mocks/features";
import { FeatureThreeItem } from "../Features/FeatureThreeItem";

export const ServiceSeven = () => {
  return (
    <section className="services-area-seven pt-120 pb-90">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7">
            <div className="section-title-two text-center mb-50">
              <span className="sub-title">What We Do For You</span>
              <h2 className="title">
                The features that make our Service unique
              </h2>
              <p>
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor amet, consectetuolor sit amet, consectetu.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {[...FEATURE_THREE_LIST, ...FEATURE_THREE_LIST].map((feature) => (
            <div key={feature.id} className="col-xl-3 col-lg-4 col-md-6">
              <FeatureThreeItem feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
