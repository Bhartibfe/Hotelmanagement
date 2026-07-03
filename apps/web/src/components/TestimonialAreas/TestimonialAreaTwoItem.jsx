import React from "react";

export const TestimonialAreaTwoItem = ({ item }) => {
  return (
    <div className="testimonial-item-two">
      <div className="testimonial-content-two">
        <div className="rating">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
        <p>“ {item.text}</p>
        <div className="testimonial-avatar">
          <div className="avatar-thumb">
            <img src={item.src} alt="" />
          </div>
          <div className="avatar-info">
            <h2 className="title">{item.title}</h2>
            <span>{item.designation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
