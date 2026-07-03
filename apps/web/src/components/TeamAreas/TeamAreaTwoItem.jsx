import React from "react";
import { Link } from "react-router-dom";

export const TeamAreaTwoItem = ({ member }) => {
  return (
    <div className="team-item-two">
      <div className="team-thumb-two">
        <Link to={member.href}>
          <img src={member.src} alt="" />
        </Link>

        <div className="team-social-two">
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

      <div className="team-content-two">
        <h2 className="title">
          <Link to={member.href}>{member.title} </Link>
        </h2>
        <span>{member.designation} </span>
      </div>
    </div>
  );
};
