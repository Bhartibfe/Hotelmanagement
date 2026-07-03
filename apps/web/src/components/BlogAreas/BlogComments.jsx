import React from "react";
import { COMMENT01, COMMENT02 } from "../../lib/assets";

export const BlogComments = () => {
  return (
    <div className="comments-wrap">
      <h3 className="comments-wrap-title">02 Comments</h3>
      <div className="latest-comments">
        <ul className="list-wrap">
          <li>
            <div className="comments-box">
              <div className="comments-avatar">
                <img src={COMMENT01} alt="img" />
              </div>
              <div className="comments-text">
                <div className="avatar-name">
                  <h6 className="name">Jessica Rose</h6>
                  <span className="date">December 27, 2023</span>
                </div>
                <p>
                  Finanappreciate your trust greatly Our clients choose dentace
                  ducts because know we are the best area Awaitingare really.
                </p>
                <a href="#" className="reply-btn">
                  Reply
                </a>
              </div>
            </div>
            <ul className="children">
              <li>
                <div className="comments-box">
                  <div className="comments-avatar">
                    <img src={COMMENT02} alt="img" />
                  </div>
                  <div className="comments-text">
                    <div className="avatar-name">
                      <h6 className="name">Parker Willy</h6>
                      <span className="date">December 28, 2023</span>
                    </div>
                    <p>
                      Finanappreciate your trust greatly Our clients choose
                      dentace ducts because know we are the best area
                      Awaitingare really.
                    </p>
                    <a href="#" className="reply-btn">
                      Reply
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
