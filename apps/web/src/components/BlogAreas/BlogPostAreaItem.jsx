import React from "react";
import { Link } from "react-router-dom";

export const BlogPostAreaItem = ({ blog }) => {
  return (
    <div className="blog-post-item">
      <div className="blog-post-thumb">
        <Link to={blog.href}>
          <img src={blog.src4} alt="" />
        </Link>

        <span className="date">
          <strong>25</strong>Jan
        </span>
      </div>

      <div className="blog-post-content">
        <Link to={blog.tagHref} className="tag">
          {blog.tag3}
        </Link>

        <h2 className="title">
          <Link to={blog.href}>{blog.title}</Link>
        </h2>

        <p>{blog.subtitle}</p>

        <Link to={blog.href} className="link-btn">
          Read More <i className="flaticon-right-arrow"></i>
        </Link>
      </div>
    </div>
  );
};
