import React from "react";
import { Layout } from "../../layouts/Layout";
import { CHECK_ICON, SERVICES_DETAILS05 } from "../../lib/assets";
import { ServicesDetailsWrapper } from "../../components/ServicesDetails/ServicesDetailsWrapper";
import { BrandSeven } from "../../components/Brand/BrandSeven";
import { ServicesDetailsFaq } from "../../components/ServicesDetails/ServicesDetailsFaq";

const ServicesDetailsPageFive = () => {
  return (
    <Layout breadcrumb={"Services"} title={"Service Details"}>
      {/* services-details-area */}
      <ServicesDetailsWrapper hideTitle>
        <div className="services-details-wrap">
          <div className="services-details-content">
            <h2 className="title">Marketing Strategy</h2>
            <p>
              when an unknown printer took ar galley offer type year anddey
              scrambled make type aewer specimen book bethas survived not only
              five when annery unknown printer.eed a little help from our
              friends from time to time. Although we offer the one-stop
              convenience.
            </p>
            <div className="services-details-thumb-two">
              <img src={SERVICES_DETAILS05} alt="" />
            </div>
            <p>
              eed a little help from our friends from time to time. Although we
              offer the one-stop convenience of annery integrated range of
              legal, financial services under one roof, there are occasions when
              our clients areaneed specia- list advice beyond the scope of our
              own expertise. That’s why we’ve developed close working
              relationships with a number of strategic partner.
            </p>
            <div className="speed-optimized-wrap">
              <h4 className="title-two">Speed Optimized</h4>
              <p>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchan galley of type and scrambled it to make a type specimen
                book.
              </p>
            </div>
            <div className="sd-inner-wrap-five">
              <div className="row">
                <div className="col-50">
                  <div className="left-side-content">
                    <h4 className="title-two">Our Business Goal</h4>
                    <p>
                      when an unknown printer took are galley type and scrambled
                      itter to make a type specimen bookhas a not only five
                      centurie when an unknown printer took a galley.
                    </p>
                  </div>
                </div>
                <div className="col-50">
                  <div className="right-side-content">
                    <h4 className="title-two">The Challange</h4>
                    <p>when an unknown printer took a galley type</p>
                    <ul className="list-wrap">
                      <li>
                        <img src={CHECK_ICON} alt="" />
                        Commercial Property Insurance
                      </li>
                      <li>
                        <img src={CHECK_ICON} alt="" />
                        Budget Friendly Theme
                      </li>
                      <li>
                        <img src={CHECK_ICON} alt="" />
                        Happy Customers
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="company-benefit-wrap">
              <h4 className="title-two">Any questions find here</h4>
              <p>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting.
              </p>

              {/* faq */}
              <ServicesDetailsFaq />
            </div>
          </div>
        </div>
      </ServicesDetailsWrapper>

      {/* brand-area */}
      <BrandSeven />
    </Layout>
  );
};

export default ServicesDetailsPageFive;
