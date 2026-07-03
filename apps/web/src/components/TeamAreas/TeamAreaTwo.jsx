import React from "react";
import { TEAM_LIST_TWO } from "../../mocks/team";
import { TeamAreaTwoItem } from "./TeamAreaTwoItem";
import { TEAM_SHAPE } from "../../lib/assets";

export const TeamAreaTwo = () => {
  return (
    <section className="team-area-two">
      <div className="team-shape">
        <img
          src={TEAM_SHAPE}
          alt=""
          data-aos="fade-right"
          data-aos-delay="200"
        />
      </div>

      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6">
            <div className="section-title-two mb-45 tg-heading-subheading animation-style3">
              <span className="sub-title">Expert People</span>
              <h2 className="title tg-element-title">
                Our Dedicated Team <br />
                Members
              </h2>
            </div>
          </div>
          <div className="col-lg-6 col-md-10">
            <div className="section-top-content mb-30">
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {TEAM_LIST_TWO.map((member) => (
            <div
              key={member.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-8"
            >
              <TeamAreaTwoItem member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
