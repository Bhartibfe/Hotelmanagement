import React from "react";
import { Link } from "react-router-dom";
import {
  H5_BANNER_MAIN_IMG,
  H5_BANNER_SHAPE01,
  H5_BANNER_SHAPE02,
  H5_BANNER_SHAPE03,
} from "../../lib/assets";

export const BannerFive = () => {
  return (
    <section className="banner-area-five has-animation">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-7 col-md-10 order-0 order-lg-2">
            <div className="banner-img-five">
              <img src={H5_BANNER_MAIN_IMG} alt="" className="main-img" />
              <img
                src={H5_BANNER_SHAPE01}
                alt=""
                className="shape-one"
                data-aos="fade-up-left"
                data-aos-delay="600"
              />
              <img src={H5_BANNER_SHAPE02} alt="" className="shape-two" />
              <img src={H5_BANNER_SHAPE03} alt="" className="shape-three" />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="banner-content-five">
              <h2 className="title" data-aos="fade-right" data-aos-delay="0">
                Get Digital
                <span>
                  Products
                  <svg
                    viewBox="0 0 183 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.1884 13.1749C27.3244 9.45935 96.6096 -9.08021 181.595 12.5919"
                      stroke="#0055FF"
                      strokeWidth="4"
                    />
                  </svg>
                </span>
                For your Business
              </h2>

              <p data-aos="fade-right" data-aos-delay="300">
                when an unknown printer took a galley type and scramble make a
                type specimen book. It has survived not only five centuries but
                also leap.
              </p>

              <Link
                to="/services"
                className="btn btn-three"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
