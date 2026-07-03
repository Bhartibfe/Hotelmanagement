import React from "react";
import cn from "classnames";

export const PricingTab = ({ isMonthly, onToggle }) => {
  return (
    <div
      className={cn("pricing-tab", !isMonthly && "selected")}
      onClick={onToggle}
    >
      <span className={cn("tab-btn monthly_tab_title", !isMonthly && "active")}>
        Monthly
      </span>
      <span
        className={cn("pricing-tab-switcher", !isMonthly && "active")}
      ></span>
      <span className={cn("tab-btn annual_tab_title", !isMonthly && "active")}>
        Yearly
      </span>
    </div>
  );
};
