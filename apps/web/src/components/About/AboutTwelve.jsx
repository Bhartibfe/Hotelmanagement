import React from "react";
import {
  H5_ABOUT_IMG,
  H5_ABOUT_SHAPE02,
  INNER_ABOUT_SHAPE03,
} from "../../lib/assets";

export const AboutTwelve = () => {
  return (
    <section className="about-area-six about-area-twelve">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-10">
            <div className="about-img-six about-img-twelve">
              <img src={H5_ABOUT_IMG} alt="" />
              <img src={INNER_ABOUT_SHAPE03} alt="" />
              <img src={H5_ABOUT_SHAPE02} alt="" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content-six">
              <div className="section-title section-title-three mb-30">
                <span className="sub-title">Expertise areas</span>
                <h2 className="title">
                  Consulting Digital Agency specializing in This Field
                </h2>
              </div>
              <p>
                Advice on comprehensive legal solutions and legal planning on
                all aspects of business, including issues
              </p>
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
    </section>
  );
};
