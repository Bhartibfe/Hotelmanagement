import React from "react";
import { Link } from "react-router-dom";
import {
  H5_ABOUT_IMG,
  H5_ABOUT_SHAPE01,
  H5_ABOUT_SHAPE02,
} from "../../lib/assets";

export const AboutSix = () => {
  return (
    <section className="about-area-six">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-10">
            <div className="about-img-six">
              <img src={H5_ABOUT_IMG} alt="" />
              <img src={H5_ABOUT_SHAPE01} alt="" />
              <img src={H5_ABOUT_SHAPE02} alt="" />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-content-six">
              <div className="section-title section-title-three mb-30 tg-heading-subheading animation-style1">
                <span className="sub-title tg-element-title">
                  Insurance Agency
                </span>
                <h2 className="title tg-element-title">
                  We’re The Best Digital Marketing Company
                </h2>
              </div>

              <p>
                when an unknown printer took a galley of type and scrambled it
                ake a type specimen book. when an unknown printer took a galley
                of type and scrambled it ake.
              </p>

              <div className="about-list">
                <ul className="list-wrap">
                  <li>
                    <i className="fas fa-arrow-right"></i>100% Better results
                  </li>
                  <li>
                    <i className="fas fa-arrow-right"></i>promis timelineI
                  </li>
                  <li>
                    <i className="fas fa-arrow-right"></i>ndisse suscipit
                    sagittis
                  </li>
                  <li>
                    <i className="fas fa-arrow-right"></i>Review Credit Reports
                  </li>
                </ul>
              </div>

              <Link to="/about" className="btn btn-three">
                Take our Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
