import React from "react";
import {
  H4_ABOUT_IMG01,
  H4_ABOUT_IMG02,
  H4_ABOUT_SHAPE,
} from "../../lib/assets";
import { Odometer } from "../Odometer/Odometer";

export const AboutFive = () => {
  return (
    <section className="about-area-five">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            <div className="about-img-wrap-five">
              <img src={H4_ABOUT_IMG01} alt="" />
              <img src={H4_ABOUT_IMG02} alt="" data-parallax='{"y" : 100 }' />
              <div className="experience-wrap">
                <h2 className="title">
                  25 <span>Years Of Experience</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="col-xl-7 col-lg-6">
            <div className="about-content-five">
              <div className="section-title-two mb-30 tg-heading-subheading animation-style2">
                <span className="sub-title tg-element-title">
                  Insurance Agency
                </span>
                <h2 className="title tg-element-title">
                  Today, any health insurance deductible can feel like
                </h2>
              </div>
              <p>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic.
              </p>
              <div className="about-content-bottom">
                <div className="about-list">
                  <ul className="list-wrap">
                    <li>
                      <i className="fas fa-arrow-right"></i>100% Better results
                    </li>
                    <li>
                      <i className="fas fa-arrow-right"></i>Suspe ndisse
                      suscipit sagittis
                    </li>
                    <li>
                      <i className="fas fa-arrow-right"></i>promis timelineI
                      guarantee
                    </li>
                    <li>
                      <i className="fas fa-arrow-right"></i>Review Credit
                      Reports
                    </li>
                  </ul>
                </div>
                <div className="about-success-wrap">
                  <ul className="list-wrap">
                    <li>
                      <div className="icon">
                        <i className="flaticon-family"></i>
                      </div>
                      <div className="content">
                        <h2 className="count">
                          <Odometer end={63} />%
                        </h2>
                        <p>Insured Customers</p>
                      </div>
                    </li>
                    <li>
                      <div className="icon">
                        <i className="flaticon-trophy"></i>
                      </div>
                      <div className="content">
                        <h2 className="count">
                          <Odometer end={95} />%
                        </h2>
                        <p>Satisfied Award</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-shape-five">
        <img src={H4_ABOUT_SHAPE} alt="" />
      </div>
    </section>
  );
};
