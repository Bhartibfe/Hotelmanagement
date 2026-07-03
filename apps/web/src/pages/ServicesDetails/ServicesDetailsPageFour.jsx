import React from "react";
import { Layout } from "../../layouts/Layout";
import {
  CHECK_ICON,
  SD_WORKING_IMG03,
  SD_WORKING_IMG04,
  SERVICES_DETAILS04,
} from "../../lib/assets";
import { ServicesDetailsWrapper } from "../../components/ServicesDetails/ServicesDetailsWrapper";
import { BrandSeven } from "../../components/Brand/BrandSeven";
import { ServicesDetailsFaq } from "../../components/ServicesDetails/ServicesDetailsFaq";

const ServicesDetailsPageFour = () => {
  return (
    <Layout breadcrumb={"Services"} title={"Service Details"}>
      {/* services-details-area */}
      <ServicesDetailsWrapper>
        <div className="services-details-wrap">
          <div className="services-details-content">
            <div className="sd-inner-wrap-four">
              <div className="row align-items-center">
                <div className="col-55">
                  <div className="thumb">
                    <img src={SERVICES_DETAILS04} alt="" />
                  </div>
                </div>
                <div className="col-45">
                  <div className="content">
                    <h2 className="title">
                      Key Features For your Insurance Business
                    </h2>
                    <p>
                      when an unknown printer took ar galley offer type year
                      anddey scrambled make type aewer specimen book bethas
                      survived not only five when annery unknown printer.
                    </p>
                    <ul className="list-wrap">
                      <li>
                        <img src={CHECK_ICON} alt="" />
                        100% Better results
                      </li>
                      <li>
                        <img src={CHECK_ICON} alt="" />
                        Valuable Ideas
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
            <div className="services-details-list-three">
              <ul className="list-wrap">
                <li>
                  <div className="icon">
                    <i className="flaticon-family"></i>
                  </div>
                  <div className="content">
                    <h4 className="title">Trusted & High Security</h4>
                    <p>
                      with a number of strategic financial services under one
                      roof
                    </p>
                  </div>
                </li>
                <li>
                  <div className="icon">
                    <i className="flaticon-winner"></i>
                  </div>
                  <div className="content">
                    <h4 className="title">Certified Company</h4>
                    <p>
                      eedlegal financial se areaet little help feryanery
                      integrated
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <p>
              eed a little help from our friends from time to time. Although we
              offer the one-stop convenience of annery integrated range of
              legal, financial services under one roof, there are occasions when
              our clients areaneed specia- list advice beyond the scope of our
              own expertise. That’s why we’ve developed close working
              relationships with a number of strategic partner.
            </p>
            <div className="industrial-working-wrap mt-50">
              <h2 className="title-two">
                Great Insurance your Solutions For Business
              </h2>
              <p className="info-one">
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchan galley of type and scrambled it to make a type specimen
                book.
              </p>
              <div className="row">
                <div className="col-md-6">
                  <img src={SD_WORKING_IMG03} alt="" />
                </div>
                <div className="col-md-6">
                  <img src={SD_WORKING_IMG04} alt="" />
                </div>
              </div>
              <p>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchan galley of type and scrambled it to make a type specimen
                book.
              </p>
            </div>

            {/* faq */}
            <ServicesDetailsFaq />
          </div>
        </div>
      </ServicesDetailsWrapper>

      {/* brand-area */}
      <BrandSeven />
    </Layout>
  );
};

export default ServicesDetailsPageFour;
