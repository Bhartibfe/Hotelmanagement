import React from "react";
import { Link } from "react-router-dom";

export const CtaAreaOne = () => {
  return (
    <section className="cta-area">
      <div className="container">
        <div className="cta-inner-wrap">
          <div className="row align-items-center">
            <div className="col-lg-9">
              <div className="cta-content">
                <div className="cta-info-wrap">
                  <div className="icon">
                    <i className="flaticon-phone-call"></i>
                  </div>
                  <div className="content">
                    <span>Call For More Info</span>
                    <a href="tel:0123456789">+123 8989 444</a>
                  </div>
                </div>
                <h2 className="title">
                  Let’s Request a Schedule For Free Consultation
                </h2>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="cta-btn text-end">
                <Link to="/contact" className="btn">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
