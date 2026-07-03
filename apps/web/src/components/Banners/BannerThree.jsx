import React from "react";
import {
  H3_BANNER_IMG01,
  H3_BANNER_IMG02,
  H3_BANNER_IMG03,
  H3_BANNER_SHAPE01,
  H3_BANNER_SHAPE02,
} from "../../lib/assets";

export const BannerThree = () => {
  return (
    <section className="banner-area-three">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9 order-0 order-lg-2">
            <div
              className="banner-img-three"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <img src={H3_BANNER_IMG01} alt="" className="main-img" />
              <img
                src={H3_BANNER_IMG02}
                alt=""
                className="img-two"
                data-parallax='{"y" : 100 }'
              />
              <img
                src={H3_BANNER_IMG03}
                alt=""
                className="img-three"
                data-parallax='{"x" : -100 }'
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="banner-content-three">
              <h2 className="title" data-aos="fade-right" data-aos-delay="0">
                Need Business Consultation Today
              </h2>
              <p data-aos="fade-right" data-aos-delay="300">
                Agilos helps you to convert your data into a strategic asset and
                get top-notch business insights.
              </p>
              <form
                action="#"
                className="banner-form"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                <input type="text" placeholder="E-mail Address" />
                <button type="submit">
                  <i className="flaticon-right-arrow"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="banner-shape-wrap-three">
        <img src={H3_BANNER_SHAPE01} alt="" />
        <img src={H3_BANNER_SHAPE02} alt="" />
      </div>
    </section>
  );
};
