import React from "react";
import { Layout } from "../../layouts/Layout";
import { BlogPageWrapper } from "../../components/BlogAreas/BlogPageWrapper";
import { BLOG_PAGE_LIST } from "../../mocks/blogs";
import { Link } from "react-router-dom";

const BlogPage = () => {
  return (
    <Layout breadcrumb={"Blog"} title={"Latest Blog"}>
      <BlogPageWrapper>
        <div className="blog-post-wrap">
          {/* list */}
          <div className="row">
            {BLOG_PAGE_LIST.map((blog) => (
              <div key={blog.id} className="col-md-6">
                <div className="blog-post-item-two">
                  <div className="blog-post-thumb-two">
                    <Link to={blog.href}>
                      <img src={blog.src} alt="" />
                    </Link>

                    <Link to={blog.tagHref} className="tag tag-two">
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
                            <img src={blog.authorSrc} alt="" />
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
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="pagination-wrap mt-30">
            <nav aria-label="Page navigation example">
              <ul className="pagination list-wrap">
                <li className="page-item">
                  <a className="page-link" href="#">
                    <i className="fas fa-angle-double-left"></i>
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    4
                  </a>
                </li>
                <li className="page-item next-page">
                  <a className="page-link" href="#">
                    <i className="fas fa-angle-double-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </BlogPageWrapper>
    </Layout>
  );
};

export default BlogPage;
