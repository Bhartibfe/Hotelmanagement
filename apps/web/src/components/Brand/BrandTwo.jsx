import React from "react";
import { BRAND_LIST } from "../../mocks/brands";
import { SlickSlider } from "../SlickSlider/SlickSlider";
import cn from "classnames";

export const BrandTwo = ({ className, title }) => {
  const slick_settings_brands = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className={cn("brand-aera-two", className)}>
      <div className="container">
        {!title ? (
          <div className="row brand-active">
            <SlickSlider settings={slick_settings_brands}>
              {BRAND_LIST.map((brand) => (
                <div key={brand.id} className="col-lg-12">
                  <div className="brand-item">
                    <img src={brand.src} alt="" />
                  </div>
                </div>
              ))}
            </SlickSlider>
          </div>
        ) : (
          <div className="brand-item-wrap">
            <h6 className="title">{title}</h6>
            <div className="row brand-active">
              <SlickSlider settings={slick_settings_brands}>
                {BRAND_LIST.map((brand) => (
                  <div key={brand.id} className="col-lg-12">
                    <div className="brand-item">
                      <img src={brand.src} alt="" />
                    </div>
                  </div>
                ))}
              </SlickSlider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
