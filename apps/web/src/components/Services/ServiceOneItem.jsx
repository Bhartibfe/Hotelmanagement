import React from "react";
import { Link } from "react-router-dom";

export const ServiceOneItem = ({ service }) => {
  return (
    <div className="services-item">
      <div className="services-content">
        <div className="content-top">
          <div className="icon">
            <i className={service.icon}></i>
          </div>

          <h2 className="title">{service.title} </h2>
        </div>

        <div className="services-thumb">
          <img src={service.src} alt="" />

          <Link to={service.href} className="btn transparent-btn">
            Our Services
          </Link>
        </div>

        <ul className="list-wrap">
          <li>seusmeyd tempose atidim area</li>
          <li>aliquam duhipsum is simply free</li>
          <li>Get Life Time Access</li>
        </ul>
      </div>
    </div>
  );
};
