import React from "react";
import { COUNTER_LIST_THREE } from "../../mocks/counter";
import { Odometer } from "../Odometer/Odometer";

export const CounterAreaThree = () => {
  return (
    <section className="counter-area-three pb-90">
      <div className="container">
        <div className="row justify-content-center">
          {COUNTER_LIST_THREE.map((item) => (
            <div key={item.id} className="col-xl-3 col-lg-4 col-sm-6">
              <div className="counter-item-three">
                <div className="counter-icon">
                  <i className={item.icon}></i>
                </div>

                <div className="counter-content">
                  <h2 className="count">
                    <Odometer end={item.count} />

                    {item.suffix}
                  </h2>

                  <p>{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
