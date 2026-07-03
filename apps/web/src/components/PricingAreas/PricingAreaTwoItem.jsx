import React from "react";
import { Link } from "react-router-dom";
import { CHECK_ICON02 } from "../../lib/assets";

export const PricingAreaTwoItem = ({ isMonthly, item }) => {
  return (
    <div className="pricing-box-two">
      {item.isPopular && <span className="popular">Popular</span>}
      <div className="pricing-head-two">
        <h4 className="title">{item.title}</h4>
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
      </div>

      <div className="pricing-bottom">
        <div className="pricing-list">
          <ul className="list-wrap">
            {item.plans.map((plan, idx) => (
              <li key={idx}>
                <img src={CHECK_ICON02} alt="" />
                {plan}
              </li>
            ))}
          </ul>
        </div>

        <div className="pricing-btn-two">
          <Link to={item.href} className="btn">
            Get The Plan Now
          </Link>
        </div>
      </div>
    </div>
  );
};
