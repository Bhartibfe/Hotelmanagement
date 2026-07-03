import React from "react";
import { QUOTE, RATING, TESTIMONIAL_IMG } from "../../lib/assets";
import {
  SlickSlider,
  SlickSliderArrowNext,
  SlickSliderArrowPrev,
} from "../SlickSlider/SlickSlider";

export const TestimonialAreaOne = () => {
  const slick_settings_brands = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    fade: true,
    arrows: true,
    prevArrow: (
      <SlickSliderArrowPrev classNameWrapper="testimonial-nav testimonial-nav-prev" />
    ),
    nextArrow: (
      <SlickSliderArrowNext classNameWrapper="testimonial-nav testimonial-nav-next" />
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
    <section className="testimonial-area testimonial-bg">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="testimonial-img">
              <img src={TESTIMONIAL_IMG} alt="" />

              <div className="review-wrap">
                <img src={RATING} alt="" />
                <div className="content">
                  <h2 className="title">15k</h2>
                  <p>
                    Positive <br />
                    Review
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="testimonial-item-wrap">
              <div className="testimonial-active">
                <SlickSlider settings={slick_settings_brands}>
                  <div className="testimonial-item">
                    <div className="testimonial-content">
                      <div className="content-top">
                        <div className="rating">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                        </div>
                        <div className="testimonial-quote">
                          <img src={QUOTE} alt="" />
                        </div>
                      </div>
                      <p>
                        “ Morem ipsum dolor sit amet, consectetur adipiscing
                        elita florai sum dolor sit amet, consecteture.Borem
                        ipsum dolor sit amet, consectetur adipiscing elita
                        Moremsit amet.
                      </p>
                      <div className="testimonial-info">
                        <h4 className="title">Mr.Robey Alexa</h4>
                        <span>CEO, Gerow Agency</span>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-item">
                    <div className="testimonial-content">
                      <div className="content-top">
                        <div className="rating">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                        </div>
                        <div className="testimonial-quote">
                          <img src={QUOTE} alt="" />
                        </div>
                      </div>
                      <p>
                        “ Morem ipsum dolor sit amet, consectetur adipiscing
                        elita florai sum dolor sit amet, consecteture.Borem
                        ipsum dolor sit amet, elita Moremsit amet.
                      </p>
                      <div className="testimonial-info">
                        <h4 className="title">Guy Hawkins</h4>
                        <span>CEO, Gerow Agency</span>
                      </div>
                    </div>
                  </div>
                </SlickSlider>
              </div>

              {/* <div className="testimonial-nav"></div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
