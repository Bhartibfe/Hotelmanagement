import React from "react";
import { AVATAR } from "../../lib/assets";

export const BlogAuthorInfo = () => {
  return (
    <div className="blog-avatar-wrap mb-65">
      <div className="blog-avatar-img">
        <a href="#">
          <img src={AVATAR} alt="img" />
        </a>
      </div>

      <div className="blog-avatar-info">
        <span className="designation">Author</span>
        <h4 className="name">
          <a href="#">Parker Willy</a>
        </h4>

        <p>
          Finanappreciate your trust greatly Our clients choose dentace ducts
          because kn ow we are the best area Awaitingare really.
        </p>
      </div>
    </div>
  );
};
