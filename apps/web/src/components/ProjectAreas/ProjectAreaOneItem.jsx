import React from "react";
import { Link } from "react-router-dom";

export const ProjectAreaOneItem = ({ project }) => {
  return (
    <div className="project-item">
      <div className="project-thumb">
        <Link to={project.href}>
          <img src={project.src} alt="" />
        </Link>
      </div>

      <div className="project-content">
        <Link to={project.tagHref} className="tag">
          {project.tag}
        </Link>

        <h2 className="title">
          <Link to={project.href}>{project.title}</Link>
        </h2>

        <Link to={project.href} className="link-arrow">
          <i className="flaticon-right-arrow"></i>
        </Link>
      </div>
    </div>
  );
};
