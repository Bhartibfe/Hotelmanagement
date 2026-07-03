import React from "react";
import { COUNTER_SHAPE01, COUNTER_SHAPE02 } from "../../lib/assets";
import { COUNTER_LIST_ONE } from "../../mocks/counter";
import { Odometer } from "../Odometer/Odometer";

export const CounterAreaOne = () => {
  return (
    <section className="counter-area counter-bg">
      <div className="container">
        <div className="row justify-content-center">
          {COUNTER_LIST_ONE.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="counter-item">
                <h2 className="count">
                  <Odometer end={item.count} />
                  {item.suffix}
                </h2>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="counter-shape-wrap">
        <img src={COUNTER_SHAPE01} alt="" className="animationFramesOne" />
        <img src={COUNTER_SHAPE02} alt="" className="animationFramesOne" />
      </div>
    </section>
  );
};
