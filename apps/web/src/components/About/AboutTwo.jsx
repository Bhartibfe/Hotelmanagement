import React from "react";
import { Link } from "react-router-dom";
import {
  ABOUT_IMG02,
  ABOUT_IMG03,
  ABOUT_SHAPE01,
  ABOUT_SHAPE02,
  CHECK_ICON,
} from "../../lib/assets";
import { VideoPlayerOne } from "../VideoPlayers/VideoPlayerOne";

export const AboutTwo = () => {
  return (
    <section className="about-area-two pt-110 pb-120">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-7 col-md-9 order-0 order-lg-2">
            <div className="about-img-two">
              <div className="main-img">
                <img src={ABOUT_IMG02} alt="" />
                <VideoPlayerOne src="https://www.youtube.com/watch?v=6mkoGSqTqFI" />
              </div>
              <img src={ABOUT_IMG03} alt="" />
            </div>
          </div>

          <div className="col-lg-5">
            <div className="about-content-two">
              <div className="section-title mb-30 tg-heading-subheading animation-style2">
                <span className="sub-title tg-element-title">Who We are</span>
                <h2 className="title tg-element-title">
                  Building Your Own Startup Has Been Simpler
                </h2>
              </div>
              <p>
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture.Borem ipsum dolor sit amet,
                consectetur adipiscing elita florai psum.
              </p>

              <div className="about-list">
                <ul className="list-wrap">
                  <li>
                    <img src={CHECK_ICON} alt="" />
                    100% Better results
                  </li>
                  <li>
                    <img src={CHECK_ICON} alt="" />
                    Valuable Ideas
                  </li>
                  <li>
                    <img src={CHECK_ICON} alt="" />
                    Budget Friendly Theme
                  </li>
                  <li>
                    <img src={CHECK_ICON} alt="" />
                    Happy Customers
                  </li>
                </ul>
              </div>

              <div className="success-wrap">
                <ul className="list-wrap">
                  <li>
                    <h2 className="count">+150,000</h2>
                    <p>Total revenue in 1 year</p>
                  </li>
                  <li>
                    <h2 className="count">90%</h2>
                    <p>Increase in sales</p>
                  </li>
                </ul>
              </div>

              <Link to="/about" className="btn transparent-btn">
                Get Started With Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="about-shape-wrap">
        <img src={ABOUT_SHAPE01} alt="" />
        <img src={ABOUT_SHAPE02} alt="" />
      </div>
    </section>
  );
};
