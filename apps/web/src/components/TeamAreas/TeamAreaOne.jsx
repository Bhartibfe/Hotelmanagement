import React from "react";
import { TEAM_LIST_ONE } from "../../mocks/team";
import { TeamAreaOneItem } from "./TeamAreaOneItem";

export const TeamAreaOne = () => {
  return (
    <section className="team-area team-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center mb-50 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">
                Skilled Team Members
              </span>
              <h2 className="title tg-element-title">
                Meet Our Dedicated Team
              </h2>
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {TEAM_LIST_ONE.map((member) => (
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-9">
              <TeamAreaOneItem member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
