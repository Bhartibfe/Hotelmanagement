import React from "react";
import { BLOGS_LIST_TWO } from "../../mocks/blogs";
import { BlogAreaFourItem } from "./BlogAreaFourItem";

export const BlogAreaFour = () => {
  return (
    <section className="blog-area-four pt-120 pb-90">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title-two text-center mb-60 tg-heading-subheading animation-style2">
              <span className="sub-title tg-element-title">News & Blogs</span>
              <h2 className="title tg-element-title">
                Read Our Latest Updates
              </h2>
              <p>
                Ever find yourself staring at your computer screen a good
                consulting slogan to come to mind? Oftentimes.
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {BLOGS_LIST_TWO.map((blog) => (
            <div key={blog.id} className="col-lg-4 col-md-6 col-sm-10">
              <BlogAreaFourItem blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
