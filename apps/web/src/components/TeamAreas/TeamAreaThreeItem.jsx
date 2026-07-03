import React, { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

export const TeamAreaThreeItem = ({ member }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="team-item-three">
      <div className="team-thumb-three">
        <img src={member.src} alt="" />

        <div
          className="team-social-three"
          style={{
            overflow: "hidden",
            height: !isOpen ? 50 : 196,
          }}
        >
          <div
            className="social-toggle-icon"
            onClick={() => setIsOpen((v) => !v)}
          >
            <i className={cn("fas ", isOpen ? "fa-times" : "fa-share-alt")}></i>
          </div>

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

      <div className="team-content-three">
        <h4 className="title">
          <Link to={member.href}>{member.title}</Link>
        </h4>
        <span>{member.designation}</span>
      </div>
    </div>
  );
};
