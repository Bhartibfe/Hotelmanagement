import React from "react";
import { CHECK_ICON02 } from "../../lib/assets";
import { Link } from "react-router-dom";
import cn from "classnames";

export const PricingAreaOneItem = ({ isMonthly, item }) => {
  return (
    <div
      className={cn("pricing-box", {
        active: item.isPopular,
      })}
    >
      {item.isPopular && <span className="popular-tag">Popular</span>}

      <div className="pricing-head">
        <h2 className="title">{item.title}</h2>
        <p>Ever find yourself staring at your follow computer screen a good</p>
      </div>

      <div className="pricing-price">
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
            <span>/anually</span>
          </h2>
        )}
      </div>

      <div className="pricing-list">
        <ul className="list-wrap">
          {item.plans.map((el) => (
            <li key={el}>
              <img src={CHECK_ICON02} alt="" />
              {el}
            </li>
          ))}
        </ul>
      </div>

      <div className="pricing-btn">
        <Link to={item.href} className="btn">
          Get The Plan Now
        </Link>
      </div>
    </div>
  );
};
