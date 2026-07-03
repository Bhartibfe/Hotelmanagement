import React from "react";
import { Link } from "react-router-dom";

export const ProjectAreaThreeItem = ({ project }) => {
  return (
    <div className="project-item-three">
      <div className="project-thumb-three">
        <Link to={project.href}>
          <img src={project.src} alt="" />
        </Link>
      </div>
    </div>
  );
};
