import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import cn from "classnames";

export const SlickSlider = React.forwardRef((props, ref) => {
  return (
    <Slider ref={ref} {...props.settings}>
      {props.children}
    </Slider>
  );
});

export const SlickSliderArrowPrev = (props) => {
  const { className, style, onClick, classNameWrapper } = props;
  return (
    <div className={cn(classNameWrapper)}>
      <button
        type="button"
        className={cn("slick-prev slick-arrow")}
        onClick={onClick}
      >
        <i className="flaticon-right-arrow"></i>
      </button>
    </div>
  );
};

export const SlickSliderArrowNext = (props) => {
  const { className, style, onClick, classNameWrapper } = props;
  return (
    <div className={cn(classNameWrapper)}>
      <button
        type="button"
        className={cn("slick-next slick-arrow")}
        onClick={onClick}
      >
        <i className="flaticon-right-arrow"></i>
      </button>
    </div>
  );
};
