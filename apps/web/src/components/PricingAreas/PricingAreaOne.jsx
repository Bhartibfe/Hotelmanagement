import React, { useState } from "react";
import { PricingTab } from "./PricingTab";
import { PRICING_LIST_ONE } from "../../mocks/Pricing";
import { PricingAreaOneItem } from "./PricingAreaOneItem";

export const PricingAreaOne = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section className="pricing-area">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title text-center mb-60 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">Pricing Chart</span>
              <h2 className="title tg-element-title">
                Best Pricing Plane For You
              </h2>
              <p>
                Ever find yourself staring at your computer screen a good
                consulting <br />
                slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>

        <div className="pricing-item-wrap">
          <PricingTab
            isMonthly={isMonthly}
            onToggle={() => setIsMonthly((v) => !v)}
          />

          <div className="row justify-content-center">
            {PRICING_LIST_ONE.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-9">
                <PricingAreaOneItem isMonthly={isMonthly} item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
