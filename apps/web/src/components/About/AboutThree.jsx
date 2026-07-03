import React, { useEffect } from "react";
import {
  ABOUT_AUTHOR,
  H2_ABOUT_IMG01,
  H2_ABOUT_IMG02,
  H2_ABOUT_SHAPE01,
  H2_ABOUT_SHAPE02,
  H2_ABOUT_SHAPE03,
  SIGNATURE,
} from "../../lib/assets";

export const AboutThree = () => {
  const list = [
    "100% Better results",
    "Suspe ndisse suscipit sagittis",
    "Promis Specific TimelineI Guarantee",
    "Review Credit Reports",
  ];

  return (
    <section className="about-area-three">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-9">
            <div className="about-img-wrap-three">
              <img
                src={H2_ABOUT_IMG01}
                alt=""
                data-aos="fade-down-right"
                data-aos-delay="0"
              />
              <img
                src={H2_ABOUT_IMG02}
                alt=""
                data-aos="fade-left"
                data-aos-delay="400"
              />
              <div
                className="experience-wrap"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <h2 className="title">
                  25 <span>Years</span>
                </h2>
                <p>Of Experience in This Finance Advisory Company.</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-content-three">
              <div className="section-title-two mb-20 tg-heading-subheading animation-style3">
                <span className="sub-title">Get To know US</span>
                <h2 className="title tg-element-title">
                  Innovative Business Solutions for Financial Company
                </h2>
              </div>
              <p className="info-one">
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture.Borem ipsum dolor sit amet,
                consectetur adipiscing elita florai psum.
              </p>

              <div className="about-list-two">
                <ul className="list-wrap">
                  {list.map((item, idx) => (
                    <li key={idx}>
                      <i className="fas fa-arrow-right"></i> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture.
              </p>
              <div className="about-author-info">
                <div className="thumb">
                  <img src={ABOUT_AUTHOR} alt="" />
                </div>
                <div className="content">
                  <h2 className="title">Mark Stranger</h2>
                  <span>CEO, Gerow Finance</span>
                </div>
                <div className="signature">
                  <img src={SIGNATURE} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-shape-wrap-two">
        <img src={H2_ABOUT_SHAPE01} alt="" />
        <img src={H2_ABOUT_SHAPE02} alt="" />
        <img
          src={H2_ABOUT_SHAPE03}
          alt=""
          data-aos="fade-left"
          data-aos-delay="500"
        />
      </div>
    </section>
  );
};
