import React from "react";
import { TESTIMONIAL_LIST_TWO } from "../../mocks/testimonials";
import { TestimonialAreaTwoItem } from "./TestimonialAreaTwoItem";
import {
  SlickSlider,
  SlickSliderArrowNext,
  SlickSliderArrowPrev,
} from "../SlickSlider/SlickSlider";

export const TestimonialAreaTwo = () => {
  const slick_settings_brands = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    arrows: true,
    prevArrow: <SlickSliderArrowPrev classNameWrapper="testimonial-nav-two" />,
    nextArrow: <SlickSliderArrowNext classNameWrapper="testimonial-nav-two" />,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="testimonial-area-two testimonial-bg-two">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="section-title-two white-title text-center mb-50 tg-heading-subheading animation-style3">
              <span className="sub-title">Our Testimonials</span>
              <h2 className="title tg-element-title">
                What Customers Say’s About Our Gerow Services
              </h2>
            </div>
          </div>
        </div>

        <div className="testimonial-item-wrap-two">
          <div className="row testimonial-active-two">
            <SlickSlider settings={slick_settings_brands}>
              {TESTIMONIAL_LIST_TWO.map((item) => (
                <div key={item.id} className="col-lg-6">
                  {" "}
                  <TestimonialAreaTwoItem item={item} />
                </div>
              ))}
            </SlickSlider>
          </div>
          {/* <div className="testimonial-nav-two"></div> */}
        </div>
      </div>
    </section>
  );
};
