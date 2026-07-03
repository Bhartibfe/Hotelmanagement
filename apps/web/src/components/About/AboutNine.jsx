import React from "react";
import {
  H3_ABOUT_IMG01,
  H3_ABOUT_IMG02,
  H3_ABOUT_SHAPE01,
  H3_ABOUT_SHAPE02,
  H3_ABOUT_SHAPE03,
} from "../../lib/assets";

export const AboutNine = () => {
  return (
    <section className="about-area-nine pt-120 pb-120">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-7 col-md-10 order-0 order-lg-2">
            <div className="about-img-wrap-four">
              <div className="mask-img-wrap">
                <img src={H3_ABOUT_IMG01} alt="" />
              </div>
              <div className="icon">
                <i className="flaticon-business-presentation"></i>
              </div>
              <img src={H3_ABOUT_IMG02} alt="" className="img-two" />
              <div className="about-shape-wrap-three">
                <img src={H3_ABOUT_SHAPE01} alt="" />
                <img src={H3_ABOUT_SHAPE02} alt="" />
                <img src={H3_ABOUT_SHAPE03} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="about-content-four">
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
              <div className="about-list-three">
                <ul className="list-wrap">
                  <li>
                    <div className="icon">
                      <i className="flaticon-profit"></i>
                    </div>
                    <div className="content">
                      <h2 className="title">Business Growth</h2>
                      <p>
                        eiusmod temporincididunt ut labore magna aliqua Quisery.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="flaticon-mission"></i>
                    </div>
                    <div className="content">
                      <h2 className="title">Target Audience</h2>
                      <p>
                        eiusmod temporincididunt ut labore magna aliqua Quisery.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
