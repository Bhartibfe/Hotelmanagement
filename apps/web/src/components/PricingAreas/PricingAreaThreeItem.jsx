import React from "react";
import { CHECK_ICON03 } from "../../lib/assets";
import { Link } from "react-router-dom";

export const PricingAreaThreeItem = ({ isMonthly, item }) => {
  return (
    <div className="pricing-box-three">
      <div className="pricing-icon">
        <i className={item.icon}></i>
      </div>

      <div className="pricing-plan">
        <h4 className="title">{item.title}</h4>
      </div>

      <div className="pricing-price-two">
        {isMonthly ? (
          <h2 className="price monthly_price">
            <strong>$</strong>
            {item.prices.monthly.toFixed(2)}
            <span>/month</span>
          </h2>
        ) : (
          <h2 className="price annual_price">
            <strong>$</strong>
            {item.prices.yearly.toFixed(2)}
            <span>/year</span>
          </h2>
        )}
      </div>

      <div className="pricing-list">
        <ul className="list-wrap">
          {item.plans.map((el, idx) => (
            <li key={idx}>
              <img src={CHECK_ICON03} alt="" />
              {el}
            </li>
          ))}
        </ul>
      </div>

      <div className="pricing-btn-two">
        <Link to={item.href} className="btn transparent-btn-two">
          Get The Plan Now
        </Link>
      </div>
    </div>
  );
};
