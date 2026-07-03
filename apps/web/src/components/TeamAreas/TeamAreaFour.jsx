import React from "react";
import { TEAM_LIST_FOUR } from "../../mocks/team";
import { TeamAreaFourItem } from "./TeamAreaFourItem";

export const TeamAreaFour = () => {
  return (
    <section className="team-area-four pt-120 pb-90">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title-two text-center mb-50 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">Expert People</span>
              <h2 className="title tg-element-title">Dedicated Team Members</h2>
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {TEAM_LIST_FOUR.map((member) => (
            <div
              key={member.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-10"
            >
              <TeamAreaFourItem member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
