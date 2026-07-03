import React from "react";
import { FEATURE_FOUR_LIST } from "../../mocks/features";

export const FeatureFour = () => {
  return (
    <section className="features-area-four">
      <div className="container">
        <div className="features-item-wrap-four">
          <div className="row justify-content-center">
            {FEATURE_FOUR_LIST.map((feature) => (
              <div key={feature.id} className="col-lg-4 col-md-6">
                <div className="features-item-four">
                  <div className="features-icon-four">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="features-content-four">
                    <h4 className="title">{feature.title} </h4>
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
