import React from "react";
import { Layout } from "../../layouts/Layout";
import {
  CHECK_ICON,
  SD_WORKING_IMG01,
  SD_WORKING_IMG02,
  SERVICES_DETAILS03,
} from "../../lib/assets";
import { ServicesDetailsWrapper } from "../../components/ServicesDetails/ServicesDetailsWrapper";
import { BrandSeven } from "../../components/Brand/BrandSeven";

const ServicesDetailsPageThree = () => {
  return (
    <Layout breadcrumb={"Services"} title={"Service Details"}>
      {/* services-details-area */}
      <ServicesDetailsWrapper>
        <div className="services-details-wrap">
          <div className="services-details-thumb">
            <img src={SERVICES_DETAILS03} alt="" />
          </div>
          <div className="services-details-content">
            <h2 className="title">Make better products make products better</h2>
            <p>
              eed a little help from our friends from time to time. Although we
              offer the one-stop convenience of annery integrated range of
              legal, financial services under one roof, there are occasions when
              our clients areaneed specia- list advice beyond the scope of our
              own expertise. That’s why we’ve developed close working
              relationships with a number of strategic partner.
            </p>
            <div className="sd-inner-wrap sd-inner-wrap-three">
              <div className="row align-items-center">
                <div className="col-43">
                  <div className="services-details-list-two">
                    <ul className="list-wrap">
                      <li>
                        <div className="icon">
                          <i className="flaticon-piggy-bank"></i>
                        </div>
                        <div className="content">
                          <h5 className="title">Finance Consulting</h5>
                          <p>
                            eed are little help fromery fri of anery integrated
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-calculator"></i>
                        </div>
                        <div className="content">
                          <h5 className="title">Tax Calculation</h5>
                          <p>
                            eed are little help fromery fri of anery integrated
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-57">
                  <div className="content">
                    <h3 className="title-two">
                      Raise capital faster & negotiate on your own terms
                    </h3>
                    <p>
                      when an unknown printer took a galley offer typey anddey
                      scrambled make a type specimen bookhas survived not only
                      five when an unknown printer took a galley of type and
                      scrambled it to make a type specimen
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
          </div>
        </div>
      </ServicesDetailsWrapper>

      {/* brand-area */}
      <BrandSeven />
    </Layout>
  );
};

export default ServicesDetailsPageThree;
