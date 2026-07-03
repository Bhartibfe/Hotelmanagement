import React from "react";
import { INNER_FEATURES_SHAPE } from "../../lib/assets";

export const FeatureSeven = () => {
  return (
    <section className="features-area-seven">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="features-content-seven">
              <div className="section-title-two mb-30">
                <span className="sub-title">Top Features</span>
                <h2 className="title">
                  Consulting Insurance firm specializing in This Field
                </h2>
              </div>
              <p>
                Advice on comprehensive legal solutions and legal planning on
                all aspects of business, including: issues under Company Law &
                Exchange Control Regulations
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="features-progress-wrap">
              <div className="progress-wrap">
                <div className="progress-item">
                  <h6 className="title">Child Insurance</h6>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Example with label"
                    aria-valuenow="55"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar wow slideInLeft"
                      data-wow-delay=".1s"
                      style={{
                        width: "55%",
                      }}
                    >
                      <span>55%</span>
                    </div>
                  </div>
                </div>
                <div className="progress-item">
                  <h6 className="title">Insurance Claim</h6>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Example with label"
                    aria-valuenow="76"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar wow slideInLeft"
                      data-wow-delay=".2s"
                      style={{
                        width: "76%",
                      }}
                    >
                      <span>76%</span>
                    </div>
                  </div>
                </div>
                <div className="progress-item">
                  <h6 className="title">Investment</h6>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Example with label"
                    aria-valuenow="90"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar wow slideInLeft"
                      data-wow-delay=".3s"
                      style={{
                        width: "90%",
                      }}
                    >
                      <span>90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="inner-features-shape">
        <img
          src={INNER_FEATURES_SHAPE}
          alt=""
          data-aos="fade-left"
          data-aos-delay="0"
        />
      </div>
    </section>
  );
};
