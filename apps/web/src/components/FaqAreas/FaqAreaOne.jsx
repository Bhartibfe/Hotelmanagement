import React from "react";
import {
  FAQ_IMG01,
  FAQ_IMG02,
  FAQ_SHAPE02,
  FAQ_SHAPE03,
} from "../../lib/assets";

export const FaqAreaOne = () => {
  return (
    <section className="faq-area">
      <div className="faq-bg-shape"></div>

      <div className="faq-shape-wrap">
        <img src={FAQ_SHAPE02} alt="" />
        <img src={FAQ_SHAPE03} alt="" />
      </div>

      <div className="container">
        <div className="row align-items-end justify-content-center">
          <div className="col-lg-6 col-md-9">
            <div className="faq-img-wrap">
              <img src={FAQ_IMG01} alt="" />
              <img src={FAQ_IMG02} alt="" data-parallax='{"y" : 100 }' />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="faq-content">
              <div className="section-title mb-30 tg-heading-subheading animation-style2">
                <span className="sub-title tg-element-title">
                  Our Service Benifits
                </span>
                <h2 className="title tg-element-title">
                  Keep Your Business Safe & Ensure High Availability.
                </h2>
              </div>
              <p>
                Ever find yourself staring at your computer s good consulting
                slogan to come to mind? Oftentimes.
              </p>

              <div className="accordion-wrap">
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
                        Interdum et malesuada fames ac ante ipsum
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
                        Interdum et malesuada fames ac ante ipsum
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
        </div>
      </div>
    </section>
  );
};
