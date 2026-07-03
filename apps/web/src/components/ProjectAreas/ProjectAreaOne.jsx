import React from "react";
import { PROJECT_LIST_ONE } from "../../mocks/projects";
import { ProjectAreaOneItem } from "./ProjectAreaOneItem";
// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from "swiper/core";

import { Swiper, SwiperSlide } from "swiper/react";
import { useSwiperArrows } from "../../lib/hooks/useSwiperArrows";

// configure Swiper to use modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export const ProjectAreaOne = () => {
  const swiper_settings = {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: false,
    breakpoints: {
      500: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 3.5,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 3.5,
        spaceBetween: 20,
      },
      1500: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
    // If we need pagination
    pagination: {
      el: ".project-swiper-pagination",
      clickable: true,
    },
  };

  const { sliderRef, toNext, toPrev } = useSwiperArrows();

  return (
    <section className="project-area project-bg">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-lg-6">
            <div className="section-title mb-40 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">Case Studies</span>
              <h2 className="title tg-element-title">
                Keep Your Business Safe & Ensure High Availability.
              </h2>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="project-top-content">
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>

        <div className="project-item-wrap">
          <div className="row">
            <div className="col-12">
              <div className="swiper-container project-active">
                <div className="swiper-wrapper">
                  <Swiper
                    {...swiper_settings}
                    onBeforeInit={(swiper) => {
                      sliderRef.current = swiper;
                    }}
                  >
                    {PROJECT_LIST_ONE.map((project) => (
                      <SwiperSlide key={project.id}>
                        <div className="swiper-slide">
                          <ProjectAreaOneItem project={project} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
