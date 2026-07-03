import React from "react";
import { FEATURE_ONE_LIST } from "../../mocks/features";

export const FeatureOne = () => {
  return (
    <section className="features-area">
      <div className="container">
        <div className="row justify-content-center">
          {FEATURE_ONE_LIST.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-6">
              <div className="features-item">
                <div className="features-content">
                  <div className="content-top">
                    <div className="icon">
                      <i className={feature.icon}></i>
                    </div>
                    <h2 className="title">{feature.title} </h2>
                  </div>
                  <p>{feature.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
