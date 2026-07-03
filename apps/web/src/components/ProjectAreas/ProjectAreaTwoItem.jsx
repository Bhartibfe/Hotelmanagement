import React from "react";
import { Link } from "react-router-dom";

export const ProjectAreaTwoItem = ({ project }) => {
  return (
    <div className="project-item-two">
      <div className="project-thumb-two">
        <img src={project.img} alt="" />
      </div>
      <div className="project-content-two">
        <h2 className="title">
          <Link to={project.href}>{project.title}</Link>
        </h2>
        <span>{project.tag}</span>
        <Link to={project.href} className="link-btn">
          <i className="fas fa-chevron-right"></i>
        </Link>
      </div>
    </div>
  );
};
