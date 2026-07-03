import React from "react";
import { H3_TESTIMONIAL_IMG } from "../../lib/assets";
import {
  SlickSlider,
  SlickSliderArrowNext,
  SlickSliderArrowPrev,
} from "../SlickSlider/SlickSlider";
import cn from 'classnames'

export const TestimonialAreaThree = ({className}) => {
  const slick_settings_brands = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    fade: true,
    arrows: true,
    prevArrow: (
      <SlickSliderArrowPrev classNameWrapper="testimonial-nav-three testimonial-nav-three-prev" />
    ),
    nextArrow: (
      <SlickSliderArrowNext classNameWrapper="testimonial-nav-three testimonial-nav-three-next" />
    ),
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
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
    <section className={cn("testimonial-area-three", className)}>
      <div className="container">
        <div className="row g-0 align-items-end">
          <div className="col-37">
            <div className="testimonial-img-three">
              <img src={H3_TESTIMONIAL_IMG} alt="" />
            </div>
          </div>

          <div className="col-63">
            <div className="testimonial-item-wrap-three">
              <div className="testimonial-active-three">
                <SlickSlider settings={slick_settings_brands}>
                  <div className="testimonial-item-three">
                    <div className="testimonial-content-three">
                      <div className="rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <p>
                        “ Morem ipsum dolor sit amet, consectetur adipiscing
                        elita florai sum dolor sit amet, consecteture.Borem
                        ipsum dolor sit amet, consectetur adipiscing elita
                        Moremsit amet.
                      </p>
                      <div className="testimonial-info">
                        <h2 className="title">Mr.Robey Alexa</h2>
                        <span>CEO, Gerow Agency</span>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-item-three">
                    <div className="testimonial-content-three">
                      <div className="rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <p>
                        “ Morem ipsum dolor sit amet, consectetur adipiscing
                        elita florai sum dolor sit amet, consecteture.Borem
                        ipsum dolor sit amet, consectetur adipiscing elita
                        Moremsit amet.
                      </p>
                      <div className="testimonial-info">
                        <h2 className="title">Mrs.Michelle Adams</h2>
                        <span>CEO, Gerow Agency</span>
                      </div>
                    </div>
                  </div>
                </SlickSlider>
              </div>

              {/* <div className="testimonial-nav-three"></div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
