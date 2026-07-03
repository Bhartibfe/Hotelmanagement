import React from "react";
import { Layout } from "../../layouts/Layout";
import { BlogPageWrapper } from "../../components/BlogAreas/BlogPageWrapper";
import { Link } from "react-router-dom";
import {
  BLOG_AVATAR01,
  BLOG_DETAILS01,
  BLOG_DETAILS02,
  CHECK_ICON,
} from "../../lib/assets";
import { VideoPlayerOne } from "../../components/VideoPlayers/VideoPlayerOne";
import { BlogAuthorInfo } from "../../components/BlogAreas/BlogAuthorInfo";
import { BlogComments } from "../../components/BlogAreas/BlogComments";
import { BlogCommentForm } from "../../components/BlogAreas/BlogCommentForm";

const BlogDetailsPage = () => {
  return (
    <Layout breadcrumb={"Blog Details"} title={"Blog Details"}>
      <BlogPageWrapper>
        {/* image */}
        <div className="blog-details-thumb">
          <img src={BLOG_DETAILS01} alt="" />
        </div>

        {/* content */}
        <div className="blog-details-content">
          <h2 className="title">Why Should Business Payroll Outsourcing</h2>

          <div className="blog-meta-three">
            <ul className="list-wrap">
              <li>
                <i className="far fa-calendar"></i>22 Jan, 2023
              </li>
              <li>
                <img src={BLOG_AVATAR01} alt="" />
                by <Link to="/blog-details">Kat Doven</Link>
              </li>
              <li>
                <i className="fas fa-tags"></i>
                <Link to="/blog">Finance,</Link>
                <Link to="/blog">Business</Link>
              </li>
              <li>
                <i className="flaticon-speech-bubble"></i>
                <Link to="/blog-details">05 Comments</Link>
              </li>
            </ul>
          </div>

          <p>
            when an unknown printer took ar galley offer type year anddey
            scrambled make type aewer specimen book bethas survived not only
            five when annery unknown printer.eed a little help from our friends
            from time to time. Although we offer the one-stop convenience.
          </p>
          <p>
            eed a little help from our friends from time to time. Although we
            offer the one-stop convenience of annery integrated range of legal,
            financial services under one roof, there are occasions when our
            clients areaneed specia- list advice beyond the scope of our own
            expertise.
          </p>
          <blockquote>
            <p>
              “ urabitur varius eros rutrum consequat Mauris aewa sollicitudin
              enim condimentum luctus enim justo non molestie nisl ”
            </p>
          </blockquote>
          <h4 className="title-two">Speed Optimized</h4>
          <p>
            when an unknown printer took a galley of type and scrambled it to
            make a type specimen bookhas a not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchan
            galley of type and scrambled it to make a type specimen book.
          </p>

          <div className="bd-inner-wrap">
            <div className="row align-items-center">
              <div className="col-46">
                <div className="thumb">
                  <img src={BLOG_DETAILS02} alt="" />

                  <VideoPlayerOne
                    src={"https://www.youtube.com/watch?v=6mkoGSqTqFI"}
                  />
                </div>
              </div>

              <div className="col-54">
                <div className="content">
                  <h3 className="title-two">
                    Conduct replied off whether arrived adapted
                  </h3>
                  <p>
                    when an unknown printer took a galley type remaining
                    essentially unchan galley of type and scrambled it to make a
                    type specimen book.
                  </p>
                  <ul className="list-wrap">
                    <li>
                      <img src={CHECK_ICON} alt="" />
                      Commercial Property Insurance
                    </li>
                    <li>
                      <img src={CHECK_ICON} alt="" />
                      Budget Friendly Theme
                    </li>
                    <li>
                      <img src={CHECK_ICON} alt="" />
                      Happy Customers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <p>
            when an unknown printer took a galley of type and scrambled it to
            make a type specimen bookhas a not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchan
            galley of type and scrambled it to make a type specimen book.
          </p>
          <div className="bd-content-bottom">
            <div className="row align-items-center">
              <div className="col-md-7">
                <div className="post-tags">
                  <h5 className="title">Tags:</h5>
                  <ul className="list-wrap">
                    <li>
                      <a href="#">Finance</a>
                    </li>
                    <li>
                      <a href="#">Marketing</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* bottom */}
              <div className="col-md-5">
                <div className="blog-post-share">
                  <h5 className="title">Share:</h5>
                  <ul className="list-wrap">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-pinterest-p"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* auhor info */}
        <BlogAuthorInfo />

        {/* comments */}
        <BlogComments />

        {/* comment form */}
        <BlogCommentForm />
      </BlogPageWrapper>
    </Layout>
  );
};

export default BlogDetailsPage;
