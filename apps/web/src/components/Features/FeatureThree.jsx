import React from "react";
import { FEATURE_THREE_LIST } from "../../mocks/features";
import { FeatureThreeItem } from "./FeatureThreeItem";

export const FeatureThree = () => {
  return (
    <section className="features-area-three">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-7">
            <div className="section-title-two text-center mb-40 tg-heading-subheading animation-style1">
              <span className="sub-title tg-element-title">
                What We Do For You
              </span>
              <h2 className="title tg-element-title">
                The features that make our Service unique
              </h2>
            </div>
          </div>
        </div>

        <div className="features-item-wrap-two">
          <div className="row justify-content-center">
            {FEATURE_THREE_LIST.map((feature) => (
              <div key={feature.id} className="col-xl-3 col-lg-4 col-md-6">
                <FeatureThreeItem feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
