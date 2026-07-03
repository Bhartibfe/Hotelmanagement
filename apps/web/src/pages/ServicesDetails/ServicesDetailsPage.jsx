import React from "react";
import { Layout } from "../../layouts/Layout";
import { ServicesDetailsFaq } from "../../components/ServicesDetails/ServicesDetailsFaq";
import { CHECK_ICON, SD_VIDEO_IMG, SERVICES_DETAILS01 } from "../../lib/assets";
import { ServicesDetailsWrapper } from "../../components/ServicesDetails/ServicesDetailsWrapper";
import { VideoPlayerOne } from "../../components/VideoPlayers/VideoPlayerOne";
import { BrandSeven } from "../../components/Brand/BrandSeven";

const ServicesDetailsPage = () => {
  return (
    <Layout breadcrumb={"Services"} title={"Service Details"}>
      {/* services-details-area */}
      <ServicesDetailsWrapper hideContact hideTitle>
        <div className="services-details-wrap">
          <div className="services-details-thumb">
            <img src={SERVICES_DETAILS01} alt="" />
          </div>

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
              own expertise. That’s why we’ve developed close working
              relationships with a number of strategic partner.
            </p>
            <p>
              when an unknown printer took a galley of type and scrambled it to
              make a type specimen bookhas survived not only five centuries, but
              also the leap into electronic typesetting, remaining essentially
              unchan galley of type and scrambled it to make a type specimen
              book.
            </p>

            <div className="sd-inner-wrap">
              <div className="row align-items-center">
                <div className="col-56">
                  <div className="content">
                    <h3 className="title-two">
                      Raise capital faster & negotiate on your own terms
                    </h3>
                    <p>
                      when an unknown printer took a galley offer typey anddey
                      scrambled make a type specimen bookhas survived not only
                      five centuries but also.
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

                <div className="col-44">
                  <div className="thumb">
                    <img src={SD_VIDEO_IMG} alt="" />

                    <VideoPlayerOne
                      src={"https://www.youtube.com/watch?v=6mkoGSqTqFI"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p>
              when an unknown printer took a galley of type and scrambled it to
              make a type specimen bookhas a not only five centuries, but also
              the leap into electronic typesetting, remaining essentially unchan
              galley of type and scrambled it to make a type specimen book.
            </p>
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

export default ServicesDetailsPage;
