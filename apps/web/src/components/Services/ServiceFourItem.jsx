import React from "react";
import { Link } from "react-router-dom";

export const ServiceFourItem = ({ service }) => {
  return (
    <div className="services-item-four">
      <div className="services-icon-four">
        <i className={service.icon}></i>
      </div>
      <div className="services-content-four">
        <h2 className="title">
          <Link to={service.href}>{service.title} </Link>
        </h2>
        <p>{service.subtitle}</p>
        <Link to={service.href} className="btn transparent-btn-two">
          Read More
        </Link>
      </div>
    </div>
  );
};
