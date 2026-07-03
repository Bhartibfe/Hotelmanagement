import React from "react";
import {
  CHOOSE_IMG_SHAPE01,
  CHOOSE_IMG_SHAPE02,
  CHOOSE_SHAPE,
  H4_CHOOSE_IMG,
} from "../../lib/assets";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Odometer } from "../Odometer/Odometer";

export const ChooseAreaTwo = () => {
  const list = [
    { id: 1, value: 55, text: "Business Growth" },
    { id: 2, value: 85, text: "Trusted Clients" },
    { id: 3, value: 98, text: "Complete Insurance" },
  ];

  return (
    <section className="choose-area-two">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="choose-img-two">
              <img src={H4_CHOOSE_IMG} alt="" />
              <img src={CHOOSE_IMG_SHAPE01} alt="" />
              <img src={CHOOSE_IMG_SHAPE02} alt="" />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="choose-content-two">
              <div className="section-title-two white-title mb-30 tg-heading-subheading animation-style2">
                <span className="sub-title tg-element-title">
                  Why Choose Us
                </span>
                <h2 className="title tg-element-title">
                  We’ll Ensure You Always Get the Best Guidance.
                </h2>
              </div>
              <p>
                Morem ipsum dolor sit amet, consectetur adipiscing elita florai
                psum dolor sit amet, consecteture.Borem.
              </p>

              <div className="choose-circle-wrap">
                {list.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      width: 160,
                      height: 160,
                    }}
                  >
                    <CircularProgressbarWithChildren
                      value={item.value}
                      strokeWidth={6}
                      maxValue={100}
                      minValue={0}
                      styles={buildStyles({
                        pathColor: "#0055FF",
                        trailColor: "#2A3E66",
                      })}
                    >
                      <div className="circle-item">
                        <div className="chart" data-percent="55">
                          <div className="circle-content">
                            <div className="d-flex">
                              <Odometer
                                end={item.value}
                                className="percentage"
                              />

                              <span className="percentage">%</span>
                            </div>
                            <p>{item.text}</p>
                          </div>
                        </div>
                      </div>
                    </CircularProgressbarWithChildren>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="choose-shape">
        <img
          src={CHOOSE_SHAPE}
          alt=""
          data-aos="fade-right"
          data-aos-delay="200"
        />
      </div>
    </section>
  );
};
