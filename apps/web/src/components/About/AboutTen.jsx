import React from "react";
import {
  H4_ABOUT_IMG01,
  H4_ABOUT_IMG02,
  H4_ABOUT_SHAPE,
} from "../../lib/assets";
import { Odometer } from "../Odometer/Odometer";

export const AboutTen = () => {
  return (
    <section className="about-area-ten">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="about-img-wrap-five about-img-wrap-ten">
              <img src={H4_ABOUT_IMG01} alt="" />
              <img src={H4_ABOUT_IMG02} alt="" data-parallax='{"y" : 100 }' />
              <div className="experience-wrap">
                <h2 className="title">
                  25 <span>Years Of Experience</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-content-five about-content-ten">
              <div className="section-title-two mb-30">
                <span className="sub-title">Get To know US</span>
                <h2 className="title">
                  We are the next gen Business experience
                </h2>
              </div>
              <p>
                With over 25 years of experience, we have crafted thousands of
                Strategic discovery process that enables us to peel back which
                enable us to understand.
              </p>
              <p>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book. It has survived not only five
                centurieswhen an unknown printer took a galley of type and
                scrambled it to make specimen book
              </p>
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

      <div className="about-shape-five">
        <img src={H4_ABOUT_SHAPE} alt="" />
      </div>
    </section>
  );
};
