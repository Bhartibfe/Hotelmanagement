import React from "react";
import { Link } from "react-router-dom";
import {
  H4_BANNER_IMG,
  H4_BANNER_SHAPE01,
  H4_BANNER_SHAPE02,
  H4_BANNER_SHAPE03,
} from "../../lib/assets";

export const BannerFour = () => {
  return (
    <section className="banner-area-four banner-bg-four">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-6 col-md-10 order-0 order-lg-2">
            <div className="banner-img-four text-end">
              <img
                src={H4_BANNER_IMG}
                alt=""
                data-aos="fade-left"
                data-aos-delay="400"
              />
            </div>
          </div>
          <div className="col-xl-5 col-lg-6">
            <div className="banner-content-four">
              <span className="sub-title" data-aos="fade-up" data-aos-delay="0">
                Insurance Agency
              </span>
              <h2 className="title" data-aos="fade-up" data-aos-delay="200">
                Enjoy Life With Safety Insurance
              </h2>
              <p data-aos="fade-up" data-aos-delay="400">
                Agilos helps you to convert your data into rategic asset emand
                get top-notch business insights.
              </p>
              <Link
                to="/services"
                className="btn btn-three"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                Discover More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="banner-shape-wrap-four">
        <img src={H4_BANNER_SHAPE01} alt="" />
        <img
          src={H4_BANNER_SHAPE02}
          alt=""
          data-aos="zoom-in"
          data-aos-delay="600"
        />
        <img
          src={H4_BANNER_SHAPE03}
          alt=""
          data-aos="zoom-in-up"
          data-aos-delay="800"
        />
      </div>
    </section>
  );
};
