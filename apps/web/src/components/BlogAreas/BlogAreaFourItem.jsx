import React from "react";
import { Link } from "react-router-dom";

export const BlogAreaFourItem = ({ blog }) => {
  return (
    <div className="blog-post-item-four">
      <div className="blog-post-thumb-four">
        <Link to={blog.href}>
          <img src={blog.src3} alt="" />
        </Link>
      </div>

      <div className="blog-post-content-four">
        <Link to={blog.tagHref} className="tag">
          {blog.tag2}
        </Link>

        <div className="blog-meta-two">
          <ul className="list-wrap">
            <li>
              <i className="far fa-calendar"></i>
              {blog.createdAt}
            </li>
            <li>
              <i className="far fa-user"></i>by{" "}
              <Link to={blog.href}>{blog.author2}</Link>
            </li>
          </ul>
        </div>

        <h4 className="title">
          <Link to={blog.href}>{blog.title}</Link>
        </h4>

        <Link to={blog.href} className="link-btn">
          Read More <i className="flaticon-right-arrow"></i>
        </Link>
      </div>
    </div>
  );
};
