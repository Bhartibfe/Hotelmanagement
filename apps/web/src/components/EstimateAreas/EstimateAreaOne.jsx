import React from "react";
import { ESTIMATE_TIME, H4_SERVICES_SHAPE } from "../../lib/assets";
import { EstimateForm } from "./EstimateForm";

export const EstimateAreaOne = () => {
  return (
    <section className="estimate-area">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="estimate-content">
              <div className="section-title-two mb-30 tg-heading-subheading animation-style2">
                <span className="sub-title tg-element-title">
                  GET A FREE ESTIMATE
                </span>
                <h2 className="title tg-element-title">
                  Get an insurance quote From Our Expertise
                </h2>
              </div>

              <div className="estimate-tab-wrap">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#home-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="home-tab-pane"
                      aria-selected="true"
                    >
                      Home
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="vehicles-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#vehicles-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="vehicles-tab-pane"
                      aria-selected="false"
                    >
                      Vehicles
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="health-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#health-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="health-tab-pane"
                      aria-selected="false"
                    >
                      Health
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="life-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#life-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="life-tab-pane"
                      aria-selected="false"
                    >
                      Life
                    </button>
                  </li>
                </ul>

                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="home-tab-pane"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                    tabindex="0"
                  >
                    <EstimateForm />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="vehicles-tab-pane"
                    role="tabpanel"
                    aria-labelledby="vehicles-tab"
                    tabindex="0"
                  >
                    <EstimateForm />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="health-tab-pane"
                    role="tabpanel"
                    aria-labelledby="health-tab"
                    tabindex="0"
                  >
                    <EstimateForm />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="life-tab-pane"
                    role="tabpanel"
                    aria-labelledby="life-tab"
                    tabindex="0"
                  >
                    <EstimateForm />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="estimate-img text-center">
              <img src={ESTIMATE_TIME} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="estimate-shape">
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
