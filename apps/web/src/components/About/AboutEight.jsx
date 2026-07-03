import React from "react";
import { Link } from "react-router-dom";
import {
  ABOUT_AUTHOR,
  INNER_ABOUT_IMG03,
  INNER_ABOUT_IMG04,
} from "../../lib/assets";

export const AboutEight = () => {
  return (
    <section className="about-area-eight pt-120 pb-120">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-9">
            <div className="about-img-eight">
              <img src={INNER_ABOUT_IMG03} alt="" />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-content-eight">
              <div className="section-title-two mb-30">
                <span className="sub-title">Get To Know More</span>
                <h2 className="title">
                  We Have More Than 20+ Years Of Practical Finance Industries
                </h2>
              </div>
              <p>
                Morem ipsum dolor sit amet consectetur adipiscing elita florai
                psum dolor sit amet consecteture Borem ipsum dolor sitter
                consectetur adipiscing elita florai rem ipsum dolor sit amet
                consectetu.
              </p>
              <div className="about-content-inner">
                <ul className="list-wrap">
                  <li>
                    <div className="icon">
                      <i className="flaticon-business-presentation"></i>
                    </div>
                    <div className="content">
                      <h4 className="title">Growing Business</h4>
                      <p>
                        Finance helps you to convert into a strategic asset get.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="flaticon-investment"></i>
                    </div>
                    <div className="content">
                      <h4 className="title">Finance Investment</h4>
                      <p>
                        Finance helps you to convert into a strategic asset get.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="right-slide-img">
                  <img src={INNER_ABOUT_IMG04} alt="" />
                </div>
              </div>

              <div className="about-content-bottom">
                <div className="services-btn">
                  <Link to="/services" className="btn">
                    Our Services
                  </Link>
                </div>

                <div className="about-author-info">
                  <div className="thumb">
                    <img src={ABOUT_AUTHOR} alt="" />
                  </div>

                  <div className="content">
                    <h2 className="title">Mark Stranger</h2>
                    <span>CEO, Gerow Finance</span>
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
