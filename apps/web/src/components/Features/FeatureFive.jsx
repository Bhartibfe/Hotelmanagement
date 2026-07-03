import React from "react";
import { FEATURE_ONE_LIST } from "../../mocks/features";
import { FEATURES_SHAPE01, FEATURES_SHAPE02 } from "../../lib/assets";

export const FeatureFive = () => {
  return (
    <section className="features-area-five features-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6">
            <div className="section-title text-center mb-50">
              <span className="sub-title">Core Features</span>
              <h2 className="title">Amazing Features For Business Solutions</h2>
            </div>
          </div>
        </div>

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

      <div className="features-shape-wrap">
        <img src={FEATURES_SHAPE01} alt="" />
        <img src={FEATURES_SHAPE02} alt="" />
      </div>
    </section>
  );
};
