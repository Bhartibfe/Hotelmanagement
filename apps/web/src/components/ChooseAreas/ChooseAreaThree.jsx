import React from "react";
import { INNER_CHOOSE_IMG } from "../../lib/assets";

export const ChooseAreaThree = () => {
  return (
    <section className="choose-area-three">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="choose-content-three">
              <div className="section-title-two white-title mb-30">
                <span className="sub-title">What Specialty</span>
                <h2 className="title">
                  Keep Your Business Safe & Ensure High Availability.
                </h2>
              </div>
              <p>
                Ever find yourself staring at your computer s good consulting
                slogan to come to mind? Oftentimes.
              </p>

              <div className="accordion-wrap-two">
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Interdum et malesuada fames ac ante ipsum
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          Ever find yourself staring at your computer screen a
                          good consulting slogan to coind yourself sta your
                          computer screen a good consulting slogan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Interdum et malesuada ante ipsum
                      </button>
                    </h2>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          Ever find yourself staring at your computer screen a
                          good consulting slogan to coind yourself sta your
                          computer screen a good consulting slogan.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Ente ipsumerdum et malesuada fames
                      </button>
                    </h2>
                    <div
                      id="collapseThree"
                      className="accordion-collapse collapse"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <p>
                          Ever find yourself staring at your computer screen a
                          good consulting slogan to coind yourself sta your
                          computer screen a good consulting slogan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="choose-img-three">
              <img src={INNER_CHOOSE_IMG} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
