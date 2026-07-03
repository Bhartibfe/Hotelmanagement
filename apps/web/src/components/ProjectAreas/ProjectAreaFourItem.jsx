import React from "react";
import { Link } from "react-router-dom";
import { PLUS_ICON } from "../../lib/assets";

export const ProjectAreaFourItem = ({ project }) => {
  return (
    <div className="project-item-four">
      <div className="project-thumb-four">
        <img src={project.src} alt="" />
        <div className="project-link">
          <Link to={project.href}>
            <img src={PLUS_ICON} alt="" />
          </Link>
        </div>
      </div>

      <div className="project-content-four">
        <h4 className="title">
          <Link to={project.href}>{project.title} </Link>
        </h4>
        <span>{project.subtitle} </span>
      </div>
    </div>
  );
};
