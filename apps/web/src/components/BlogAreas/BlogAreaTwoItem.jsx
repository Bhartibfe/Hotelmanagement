import React from "react";
import { Link } from "react-router-dom";

export const BlogAreaTwoItem = ({ blog }) => {
  return (
    <div className="blog-post-item-two">
      <div className="blog-post-thumb-two">
        <Link to={blog.href}>
          <img src={blog.src} alt="" />
        </Link>
        <Link to={blog.tagHref} className="tag">
          {blog.tag}
        </Link>
      </div>

      <div className="blog-post-content-two">
        <h2 className="title">
          <Link to={blog.href}>{blog.title}</Link>
        </h2>

        <p>{blog.subtitle}</p>

        <div className="blog-meta">
          <ul className="list-wrap">
            <li>
              <Link to={blog.href}>
                <img src={blog.avatar} alt="" />
                {blog.author}
              </Link>
            </li>

            <li>
              <i className="far fa-calendar"></i>
              {blog.createdAt}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
