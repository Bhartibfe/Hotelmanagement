import React from "react";
import { CONTACT_SHAPE } from "../../lib/assets";

export const ContactAreaOne = () => {
  return (
    <section className="contact-area contact-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="contact-content">
              <div className="section-title mb-30 tg-heading-subheading animation-style2">
                <span className="sub-title tg-element-title">GET IN TOUCH</span>
                <h2 className="title tg-element-title">
                  We Are Connected To Help Your Business!
                </h2>
              </div>
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form">
              <form action="#">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-grp">
                      <input type="text" placeholder="Name *" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-grp">
                      <input type="email" placeholder="E-mail *" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-grp">
                      <input type="number" placeholder="Phone *" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-grp">
                      <input type="text" placeholder="Subject *" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-grp">
                      <textarea placeholder="Comments *"></textarea>
                    </div>
                  </div>
                </div>
                <button type="submit">Submit Now</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-shape">
        <img src={CONTACT_SHAPE} alt="" />
      </div>
    </section>
  );
};
