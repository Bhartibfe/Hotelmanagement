import React from "react";
import { FEATURE_TWO_LIST } from "../../mocks/features";

export const FeatureTwo = () => {
  return (
    <section className="features-area-two pt-80">
      <div className="container">
        <div className="features-item-wrap">
          <div className="row justify-content-center">
            {/* features */}
            {FEATURE_TWO_LIST.map((feature) => (
              <div key={feature.id} className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-item-two">
                  <div className="features-icon-two">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="features-content-two">
                    <h4 className="title">{feature.title}</h4>
                    <p>{feature.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
