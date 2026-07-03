import React from "react";
import { INNER_COUNTER_SHAPE } from "../../lib/assets";
import { COUNTER_LIST_THREE } from "../../mocks/counter";
import { Odometer } from "../Odometer/Odometer";

export const CounterAreaFour = () => {
  return (
    <section className="counter-area-four">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="counter-content-four">
              <div className="section-title-two mb-30">
                <span className="sub-title">Top Features</span>
                <h2 className="title">
                  Consulting is a law firm specializing in corporate finance
                  work
                </h2>
              </div>
              <p>
                Advice on comprehensive legal solutions and legal planning on
                all aspects of business, including: issues under Company Law &
                Exchange Control Regulations
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="counter-item-wrap-four">
              <ul className="list-wrap">
                {COUNTER_LIST_THREE.map((item) => (
                  <li key={item.id}>
                    <div className="counter-item-three">
                      <div className="counter-icon">
                        <i className={item.icon}></i>
                      </div>
                      <div className="counter-content">
                        <h2 className="count">
                          <Odometer end={item.count} /> {item.suffix}
                        </h2>
                        <p>{item.title} </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="inner-counter-shape">
        <img
          src={INNER_COUNTER_SHAPE}
          alt=""
          data-aos="fade-left"
          data-aos-delay="0"
        />
      </div>
    </section>
  );
};
