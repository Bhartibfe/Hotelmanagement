import React from "react";
import { Link } from "react-router-dom";
import { REQUEST_SHAPE } from "../../lib/assets";

export const RequestAreaOne = () => {
  return (
    <section className="request-area request-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="request-content tg-heading-subheading animation-style1">
              <h2 className="title tg-element-title">
                Let’s Request a Schedule For <br />
                Free Consultation
              </h2>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="request-content-right">
              <div className="request-contact">
                <div className="icon">
                  <i className="flaticon-phone-call"></i>
                </div>
                <div className="content">
                  <span>Hotline 24/7</span>
                  <a href="tel:0123456789">+123 8989 444</a>
                </div>
              </div>
              <div className="request-btn">
                <Link to="/contact" className="btn">
                  Request a Schedule
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="request-shape">
        <img src={REQUEST_SHAPE} alt="" />
      </div>
    </section>
  );
};
