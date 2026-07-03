import React from "react";
import { Odometer } from "../Odometer/Odometer";
import { COUNTER_LIST_TWO } from "../../mocks/counter";

export const CounterAreaTwo = () => {
  return (
    <section className="counter-area-two">
      <div className="container">
        <div className="counter-item-wrap">
          <div className="row justify-content-center">
            {COUNTER_LIST_TWO.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="counter-item-two">
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
      </div>
    </section>
  );
};
