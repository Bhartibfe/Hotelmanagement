import React from "react";
import { SERVICES_ONE_LIST } from "../../mocks/services";
import { ServiceOneItem } from "./ServiceOneItem";
import { SlickSlider } from "../SlickSlider/SlickSlider";

export const ServiceOne = () => {
  const slick_settings_brands = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section className="services-area services-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="section-title white-title text-center mb-50 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">
                Our Dedicated Services
              </span>
              <h2 className="title tg-element-title">
                Spotlight Some Most <br />
                Important Features We Have
              </h2>
              <p>Borem ipsum dolor sit amet consectetur adipiscing elita</p>
            </div>
          </div>
        </div>

        <div className="row services-active">
          <SlickSlider settings={slick_settings_brands}>
            {SERVICES_ONE_LIST.map((service) => (
              <div key={service.id} className="col-lg-4">
                <ServiceOneItem service={service} />
              </div>
            ))}
          </SlickSlider>
        </div>
      </div>
    </section>
  );
};
