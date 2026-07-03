import React from "react";
import { Link } from "react-router-dom";

export const FeatureThreeItem = ({ feature }) => {
  return (
    <div className="features-item-three">
      <div className="features-icon-three">
        <i className="flaticon-inspiration"></i>
      </div>
      <div className="features-content-three">
        <h2 className="title">{feature.title}</h2>
        <p>{feature.subtitle}</p>
        <Link to={feature.href} className="link-btn">
          See Details <img src={feature.src} alt="" />
        </Link>
      </div>
    </div>
  );
};
