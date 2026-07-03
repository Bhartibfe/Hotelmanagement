import React from "react";
import { Link } from "react-router-dom";

export const ServicesTwoItem = ({ service }) => {
  return (
    <div className="services-item-two">
      <div className="services-thumb-two">
        <img src={service.src} alt="" />
        <div className="item-shape">
          <img src={service.srcShape} alt="" />
        </div>
      </div>
      <div className="services-content-two">
        <div className="icon">
          <i className={service.icon}></i>
        </div>
        <h2 className="title">
          <Link to={service.href}>{service.title}</Link>
        </h2>
        <p>{service.subtitle}</p>
      </div>
    </div>
  );
};
