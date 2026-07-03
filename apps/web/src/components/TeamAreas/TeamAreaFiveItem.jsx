import React from "react";
import { Link } from "react-router-dom";

export const TeamAreaFiveItem = ({ member }) => {
  return (
    <div className="team-item-five">
      <div className="team-thumb-five">
        <img src={member.src} alt="" />
      </div>

      <div className="team-content-five">
        <h2 className="title">
          <Link to={member.href}>{member.title} </Link>
        </h2>
        <span>{member.designation} </span>

        <div className="team-social-four">
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
  );
};
