import React from "react";
import { Link } from "react-router-dom";
import { PROJECT_LIST_FOUR } from "../../mocks/projects";
import { ProjectAreaFourItem } from "./ProjectAreaFourItem";
import cn from "classnames";

export const ProjectAreaFour = () => {
  return (
    <section className="project-area-four">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-8">
            <div className="section-title section-title-three mb-50 tg-heading-subheading animation-style1">
              <span className="sub-title tg-element-title">Case Studies</span>
              <h2 className="title tg-element-title">
                We’ve Done Lot’s Of Work, Let’s Check Some From Here
              </h2>
            </div>
          </div>
          <div className="col-lg-6 col-md-4">
            <div className="view-all-btn text-end mb-30">
              <Link to="/project-details" className="btn btn-three">
                See All Projects
              </Link>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {PROJECT_LIST_FOUR.map((project, idx) => (
            <div
              key={project.id}
              className={cn(
                [0, 1].includes(idx) ? "col-lg-6 col-md-6" : "col-lg-4 col-md-6"
              )}
            >
              <ProjectAreaFourItem project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
