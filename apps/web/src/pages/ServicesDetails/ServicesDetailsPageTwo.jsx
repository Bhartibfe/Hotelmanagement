import React from "react";
import { Layout } from "../../layouts/Layout";
import { ServicesDetailsFaq } from "../../components/ServicesDetails/ServicesDetailsFaq";
import {
  SD_WORKING_IMG01,
  SD_WORKING_IMG02,
  SERVICES_DETAILS02,
} from "../../lib/assets";
import { ServicesDetailsWrapper } from "../../components/ServicesDetails/ServicesDetailsWrapper";
import { BrandSeven } from "../../components/Brand/BrandSeven";

const ServicesDetailsPageTwo = () => {
  return (
    <Layout breadcrumb={"Services"} title={"Service Details"}>
      {/* services-details-area */}
      <ServicesDetailsWrapper>
        <div className="services-details-wrap">
          <div className="services-details-content">
            <h2 className="title">
              We help our clients identify their they area issues develop
              solutions and take action
            </h2>
            <p>
              eed a little help from our friends from time to time. Although we
              offer the one-stop convenience of annery integrated range of
              legal, financial services under one roof, there are occasions when
              our clients areaneed specia- list advice beyond the scope of our
              own expertise.
            </p>
            <div className="sd-inner-wrap-two">
              <div className="row align-items-center">
                <div className="col-58">
                  <div className="thumb">
                    <img src={SERVICES_DETAILS02} alt="" />
                  </div>
                </div>
                <div className="col-42">
                  <div className="services-details-list">
                    <ul className="list-wrap">
                      <li>
                        <div className="icon">
                          <i className="flaticon-business-presentation"></i>
                        </div>
                        <div className="content">
                          <h5 className="title">Growing Business</h5>
                          <p>
                            Finance helps you to convert into a strategic asset
                            get.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-investment"></i>
                        </div>
                        <div className="content">
                          <h5 className="title">Finance Investment</h5>
                          <p>
                            Finance helps you to convert into a strategic asset
                            get.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-taxes"></i>
                        </div>
                        <div className="content">
                          <h5 className="title">Tax Advisory</h5>
                          <p>
                            Finance helps you to convert into a strategic asset
                            get.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="industrial-working-wrap">
              <h2 className="title-two">Quality Industrial Working</h2>
              <p className="info-one">
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchan galley of type and scrambled it to make a type specimen
                book.
              </p>
              <div className="row">
                <div className="col-md-6">
                  <img src={SD_WORKING_IMG01} alt="" />
                </div>
                <div className="col-md-6">
                  <img src={SD_WORKING_IMG02} alt="" />
                </div>
              </div>
              <p className="info-two">
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchan galley of type and scrambled it to make a type specimen
                book.
              </p>
            </div>
            <div className="company-benefit-wrap">
              <h2 className="title-two">Company Key Benefits</h2>
              <p>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen bookhas a not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchan galley of type and scrambled it to make a type specimen
                book.
              </p>

              {/* faq accordion */}
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

export default ServicesDetailsPageTwo;
