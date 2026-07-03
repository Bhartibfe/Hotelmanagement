import React from "react";
import { PROJECT_LIST_TWO } from "../../mocks/projects";
import { ProjectAreaTwoItem } from "./ProjectAreaTwoItem";

export const ProjectAreaTwo = () => {
  return (
    <section className="project-area-two project-bg-two">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6">
            <div className="section-title-two mb-40 tg-heading-subheading animation-style3">
              <span className="sub-title">Complete Projects</span>
              <h2 className="title tg-element-title">
                Our recently completed <br />
                projects list
              </h2>
            </div>
          </div>
          <div className="col-lg-6 col-md-10">
            <div className="project-content-top">
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container custom-container">
        <div className="row justify-content-center">
          {PROJECT_LIST_TWO.map((project) => (
            <div key={project.id} className="col-lg-4 col-md-6 col-sm-10">
              <ProjectAreaTwoItem project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
