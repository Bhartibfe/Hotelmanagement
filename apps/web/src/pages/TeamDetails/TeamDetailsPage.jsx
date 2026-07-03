import React from "react";
import { Layout } from "../../layouts/Layout";
import { SHARE, TEAM_DETAILS_IMG } from "../../lib/assets";

const TeamDetailsPage = () => {
  return (
    <Layout breadcrumb={"Team Details"} title={"Team Details"}>
      {/* team-details-area */}
      <section className="team-details-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="team-details-info-wrap">
                <div className="team-details-thumb">
                  <img src={TEAM_DETAILS_IMG} alt="" />
                </div>

                <div className="team-details-info">
                  <ul className="list-wrap">
                    <li>
                      <i className="flaticon-phone-call"></i>+123 8989 444
                    </li>
                    <li>
                      <i className="flaticon-mail"></i>info@gmail.com
                    </li>
                    <li>
                      <i className="flaticon-location"></i>256 Avenue, Mark
                      Street, Newyork City
                    </li>
                  </ul>
                  <div className="td-info-bottom">
                    <a href="#" className="btn btn-three">
                      Contact With Me
                    </a>
                    <a href="#" className="share-btn">
                      <img src={SHARE} alt="" />
                      Share
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="team-details-content">
                <h2 className="title">Leslie Alexander</h2>
                <span>Finance Advisor</span>
                <p>
                  estibulum ac diam sit amet quam vehicula elementum sed sit
                  amet dui Sed porttitor lect us nibh. Praesent sapien massa,
                  convallis a pellentesquam vehiculaestibulum ac diam sit amet
                  quam vehicula elementumsit amet dui Sed porttitor lectus
                  nibPraesent sapien massa convallis a pellentese nec diam sit
                  amet quam vehicula.
                </p>
                <div className="team-skill-wrap">
                  <h3 className="title-two">My Expertise & Skills</h3>
                  <p>
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book It has survived not only
                    five centuries
                  </p>
                  <div className="progress-wrap">
                    <div className="progress-item">
                      <h6 className="title">Finance Consultancy</h6>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Example with label"
                        aria-valuenow="65"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar wow slideInLeft"
                          data-wow-delay=".1s"
                          style={{
                            width: "65%",
                          }}
                        >
                          <span>65%</span>
                        </div>
                      </div>
                    </div>
                    <div className="progress-item">
                      <h6 className="title">Business</h6>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Example with label"
                        aria-valuenow="80"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar wow slideInLeft"
                          data-wow-delay=".2s"
                          style={{
                            width: "80%",
                          }}
                        >
                          <span>80%</span>
                        </div>
                      </div>
                    </div>
                    <div className="progress-item">
                      <h6 className="title">Marketing</h6>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Example with label"
                        aria-valuenow="90"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar wow slideInLeft"
                          data-wow-delay=".3s"
                          style={{
                            width: "90%",
                          }}
                        >
                          <span>90%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>
                    estibulum ac diam sit amet quam vehicula elementum sed sit
                    amet dui Sed porttitor lect us nibh. Praesent sapien massa,
                    convallis a pellentesquam vehiculaestibulum ac diam sit amet
                    quam vehicula elementumsit amet dui Sed porttitor lectus
                    nibPraesent sapien massa convallis a pellentese nec diam sit
                    amet quam vehicula.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamDetailsPage;
