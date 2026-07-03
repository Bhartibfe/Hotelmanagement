import React from "react";
import {
  H2_BANNER_IMG,
  H2_BANNER_SHAPE01,
  H2_BANNER_SHAPE02,
  H2_BANNER_SHAPE03,
} from "../../lib/assets";
import { Link } from "react-router-dom";
import { VideoPlayerOne } from "../VideoPlayers/VideoPlayerOne";

export const BannerTwo = () => {
  return (
    <>
      <section className="banner-area-two banner-bg-two">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="banner-content-two">
                <span
                  className="sub-title"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  We Are Expert In This Field
                </span>
                <h2 className="title" data-aos="fade-up" data-aos-delay="300">
                  Get a Smart Way For Your Business
                </h2>
                <p data-aos="fade-up" data-aos-delay="500">
                  Agilos helps you to convert your data into a strategic asset
                  and get top-notch business insights.
                </p>
                <div className="banner-btn">
                  <Link
                    to="/services"
                    className="btn"
                    data-aos="fade-right"
                    data-aos-delay="700"
                  >
                    Our Services
                  </Link>

                  <VideoPlayerOne
                    src="https://www.youtube.com/embed/XMWYZ-uZjnQ"
                    text="Watch The Video"
                    data-aos="fade-left"
                    data-aos-delay="700"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="banner-img text-center">
                <img
                  src={H2_BANNER_IMG}
                  alt=""
                  data-aos="fade-left"
                  data-aos-delay="400"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="banner-shape-wrap">
          <img src={H2_BANNER_SHAPE01} alt="" />
          <img src={H2_BANNER_SHAPE02} alt="" />
          <img
            src={H2_BANNER_SHAPE03}
            alt=""
            data-aos="zoom-in-up"
            data-aos-delay="800"
          />
        </div>
      </section>
    </>
  );
};
