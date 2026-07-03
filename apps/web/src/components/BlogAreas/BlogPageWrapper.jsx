import React from "react";
import { BlogPageSidebar } from "./BlogPageSidebar";

export const BlogPageWrapper = ({ children }) => {
  return (
    <section className="blog-area pt-120 pb-120">
      <div className="container">
        <div className="inner-blog-wrap">
          <div className="row justify-content-center">
            {/* content */}
            <div className="col-71">{children}</div>

            {/* sidebar */}
            <div className="col-29">
              <BlogPageSidebar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
