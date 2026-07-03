import React from "react";
import { TEAM_LIST_THREE } from "../../mocks/team";
import { TeamAreaThreeItem } from "./TeamAreaThreeItem";

export const TeamAreaThree = () => {
  return (
    <section className="team-area-three">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title-two text-center mb-50 tg-heading-subheading animation-style1">
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
          {TEAM_LIST_THREE.map((member) => (
            <div
              key={member.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-8"
            >
              <TeamAreaThreeItem member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
