import React from "react";
import { Link } from "react-router-dom";

export const ServicesThreeItem = ({ service }) => {
  return (
    <div className="services-item-three">
      <div className="services-thumb-three">
        <Link to={service.href}>
          <img src={service.src} alt="" />
        </Link>
      </div>

      <div className="services-content-three">
        <div className="services-icon">
          <i className={service.icon}></i>
        </div>

        <h4 className="title">
          <Link to={service.href}>{service.title}</Link>
        </h4>

        <p>{service.subtitle}</p>

        <div className="overlay-icon">
          <i className={service.icon}></i>
        </div>
      </div>
    </div>
  );
};
