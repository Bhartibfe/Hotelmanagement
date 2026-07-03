import React from "react";
import { Link } from "react-router-dom";
import { Odometer } from "../Odometer/Odometer";
import {
  INNER_ABOUT_IMG01,
  INNER_ABOUT_IMG02,
  INNER_ABOUT_SHAPE01,
} from "../../lib/assets";

export const AboutSeven = () => {
  return (
    <section className="about-area-seven pt-120 pb-120">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-9 order-0 order-lg-2">
            <div className="about-img-seven-wrap">
              <img
                src={INNER_ABOUT_IMG01}
                alt=""
                data-aos="fade-right"
                data-aos-delay="0"
              />
              <img
                src={INNER_ABOUT_IMG02}
                alt=""
                data-aos="fade-up"
                data-aos-delay="300"
              />
              <img
                src={INNER_ABOUT_SHAPE01}
                alt=""
                className="shape"
                data-aos="zoom-in"
                data-aos-delay="500"
              />
              <div
                className="experience-wrap"
                data-aos="fade-left"
                data-aos-delay="0"
              >
                <h2 className="title">25</h2>
                <p>Years Of Experience</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-content-seven">
              <div className="section-title mb-30">
                <span className="sub-title">Who We are</span>
                <h2 className="title">
                  Innovative Business Solutions For Success Company
                </h2>
              </div>
              <p>
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet consecteture Borem ipsum dolor sitter
                consectetur adipiscing elita florai psum.
              </p>

              <div className="success-wrap-two">
                <ul className="list-wrap">
                  <li>
                    <div className="icon">
                      <i className="flaticon-investment"></i>
                    </div>
                    <div className="content">
                      <h2 className="count">
                        <Odometer end={152} />K
                      </h2>
                      <p>Total revenue</p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="flaticon-business-presentation"></i>
                    </div>
                    <div className="content">
                      <h2 className="count">
                        <Odometer end={95} />%
                      </h2>
                      <p>Increase in sales</p>
                    </div>
                  </li>
                </ul>
              </div>

              <p className="info-two">
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture. consecteture.Borem ipsum
                dolor sit amectetur adipiscing.
              </p>

              <Link to="/contact" className="btn btn-three">
                Contact With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
