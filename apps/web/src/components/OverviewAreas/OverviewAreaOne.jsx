import React from "react";
import {
  OVERVIEW_IMG01,
  OVERVIEW_IMG02,
  OVERVIEW_IMG_SHAPE,
} from "../../lib/assets";
import { Odometer } from "../Odometer/Odometer";

export const OverviewAreaOne = () => {
  return (
    <section className="overview-area pt-120 pb-120">
      <div
        className="overview-shape"
        data-aos="fade-left"
        data-aos-delay="200"
      ></div>
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-10">
            <div className="overview-img-wrap">
              <img src={OVERVIEW_IMG01} alt="" />
              <img src={OVERVIEW_IMG02} alt="" data-parallax='{"x" : 50 }' />
              <img src={OVERVIEW_IMG_SHAPE} alt="" />
              <div className="icon">
                <i className="flaticon-report-1"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="overview-content">
              <div className="section-title-two mb-20 tg-heading-subheading animation-style3">
                <span className="sub-title">Company Overview</span>
                <h2 className="title tg-element-title">
                  Plan your business strategy with Our Experts
                </h2>
              </div>
              <p className="info-one">
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture.Borem ipsum dolor sit amet,
                consectetur adipiscing elita florai psum.
              </p>
              <p className="info-two">
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture.Borem.
              </p>
              <div className="content-bottom">
                <ul className="list-wrap">
                  <li>
                    <div className="icon">
                      <i className="flaticon-trophy"></i>
                    </div>
                    <div className="content">
                      <h2 className="count">
                        <Odometer end={235} />+
                      </h2>
                      <p>Best Award</p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="flaticon-rating"></i>
                    </div>
                    <div className="content">
                      <h2 className="count">
                        <Odometer end={98} />k
                      </h2>
                      <p>Happy Clients</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
