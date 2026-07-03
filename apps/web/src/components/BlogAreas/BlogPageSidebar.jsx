import React from "react";
import { Link } from "react-router-dom";
import { BLOG_CATEGORIES, BLOG_TAGS, RECENT_BLOGS } from "../../mocks/blogs";

export const BlogPageSidebar = () => {
  return (
    <aside className="blog-sidebar">
      {/* search */}
      <div className="sidebar-search">
        <form action="#">
          <input type="text" placeholder="Search Here . . ." />
          <button type="submit">
            <i className="flaticon-search"></i>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="blog-widget">
        <h4 className="bw-title">Categories</h4>

        <div className="bs-cat-list">
          <ul className="list-wrap">
            {BLOG_CATEGORIES.map((cat, idx) => (
              <li key={idx}>
                <a href="#">
                  {cat.label} <span>({cat.value})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* recents */}
      <div className="blog-widget">
        <h4 className="bw-title">Recent Posts</h4>

        <div className="rc-post-wrap">
          {RECENT_BLOGS.map((blog) => (
            <div key={blog.id} className="rc-post-item">
              <div className="thumb">
                <Link to={blog.href}>
                  <img src={blog.src} alt="" />
                </Link>
              </div>
              <div className="content">
                <span className="date">
                  <i className="far fa-calendar"></i>
                  {blog.createdAt}
                </span>
                <h2 className="title">
                  <Link to={blog.href}>{blog.title}</Link>
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tags */}
      <div className="blog-widget">
        <h4 className="bw-title">Tags</h4>

        <div className="bs-tag-list">
          <ul className="list-wrap">
            {BLOG_TAGS.map((item) => (
              <li key={item}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
