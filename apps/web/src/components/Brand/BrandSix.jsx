import React from "react";
import { SlickSlider } from "../SlickSlider/SlickSlider";
import { BRAND_LIST } from "../../mocks/brands";

export const BrandSix = () => {
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
    <div className="brand-area-six pt-80 pb-80">
      <div className="container">
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
    </div>
  );
};
