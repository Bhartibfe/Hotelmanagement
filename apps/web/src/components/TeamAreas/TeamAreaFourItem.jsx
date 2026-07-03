import React, { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

export const TeamAreaFourItem = ({ member }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="team-item-four">
      <div className="team-thumb-four">
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

      <div className="team-content-four">
        <h2 className="title">
          <Link to={member.href}>{member.title}</Link>
        </h2>
        <span>{member.designation} </span>
      </div>
    </div>
  );
};
