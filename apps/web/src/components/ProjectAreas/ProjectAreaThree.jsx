import React from "react";
import { PROJECT_LIST_THREE } from "../../mocks/projects";
import { ProjectAreaThreeItem } from "./ProjectAreaThreeItem";

export const ProjectAreaThree = () => {
  return (
    <section className="project-area-three pb-90">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 col-md-8">
            <div className="section-title-two mb-40 tg-heading-subheading animation-style1">
              <span className="sub-title tg-element-title">
                Complete Projects
              </span>
              <h2 className="title tg-element-title">
                A Complete Solution For Global Business
              </h2>
            </div>
          </div>
          <div className="col-lg-7 col-md-4">
            <div className="view-all-btn text-end mb-30">
              <a href="project-details.html" className="btn btn-three">
                See All Projects
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container custom-container-three">
        <div className="row">
          {PROJECT_LIST_THREE.map((project) => (
            <div key={project.id} className="col-lg-3 col-md-6 col-sm-6">
              <ProjectAreaThreeItem project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
