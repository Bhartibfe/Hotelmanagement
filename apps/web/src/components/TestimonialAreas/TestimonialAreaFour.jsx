import React from "react";
import {
  H4_TESTIMONIAL_IMG,
  H4_TESTIMONIAL_IMG_SHAPE,
  H4_TESTIMONIAL_SHAPE01,
  H4_TESTIMONIAL_SHAPE02,
  QUOTE02,
} from "../../lib/assets";
import {
  SlickSlider,
  SlickSliderArrowNext,
  SlickSliderArrowPrev,
} from "../SlickSlider/SlickSlider";

export const TestimonialAreaFour = () => {
  const slick_settings_brands = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    arrows: true,
    prevArrow: (
      <SlickSliderArrowPrev classNameWrapper="testimonial-nav-four testimonial-nav-four-prev" />
    ),
    nextArrow: (
      <SlickSliderArrowNext classNameWrapper="testimonial-nav-four testimonial-nav-four-next" />
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
    <section className="testimonial-area-four testimonial-bg-four">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="testimonial-img-four">
              <img src={H4_TESTIMONIAL_IMG} alt="" />
              <div className="icon">
                <img src={QUOTE02} alt="" />
              </div>
              <img src={H4_TESTIMONIAL_IMG_SHAPE} alt="" className="shape" />
            </div>
          </div>

          <div className="col-lg-7">
            <div className="testimonial-item-wrap-four">
              <div className="testimonial-active-four">
                <SlickSlider settings={slick_settings_brands}>
                  <div className="testimonial-item-four">
                    <div className="testimonial-content-four">
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
                        ipsum consectetur adipiscinsit consectetur adipiscing.”
                      </p>
                      <div className="testimonial-info">
                        <h2 className="title">Mr.Robey Alexa</h2>
                        <span>CEO, Gerow Agency</span>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-item-four">
                    <div className="testimonial-content-four">
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
                        ipsum consectetur adipiscinsit consectetur adipiscing.”
                      </p>
                      <div className="testimonial-info">
                        <h2 className="title">Mr.Robey Alexa</h2>
                        <span>CEO, Gerow Agency</span>
                      </div>
                    </div>
                  </div>
                </SlickSlider>
              </div>

              {/* <div className="testimonial-nav-four"></div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="testimonial-shape-wrap-four">
        <img
          src={H4_TESTIMONIAL_SHAPE01}
          alt=""
          data-aos="fade-up-right"
          data-aos-delay="200"
        />
        <img
          src={H4_TESTIMONIAL_SHAPE02}
          alt=""
          data-aos="fade-down-left"
          data-aos-delay="200"
        />
      </div>
    </section>
  );
};
