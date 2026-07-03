import React, { useState } from "react";

export const EstimateForm = () => {
  const [range, setRange] = useState(400000);

  return (
    <div className="estimate-form-wrap">
      <form action="#">
        <div className="form-grp">
          <input type="text" placeholder="Full Name" />
        </div>
        <div className="form-grp">
          <input type="email" placeholder="E-mail" />
        </div>
        <div className="form-grp">
          <input type="number" placeholder="Phone" />
        </div>
        <div className="range-slider-wrap">
          <div className="content-top">
            <p>Limits of balance:</p>
            <span>
              $<strong id="rangeValue">{range}</strong>
            </span>
          </div>

          <input
            className="range"
            type="range"
            value={range}
            min="0"
            max="600000"
            onChange={(e) => setRange(e.target.value)}
            onMouseMove={(e) => setRange(e.target.value)}
          />
        </div>

        <button className="btn btn-three" type="submit">
          Get a Quote Now
        </button>
      </form>
    </div>
  );
};
