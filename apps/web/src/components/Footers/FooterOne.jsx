import React from "react";
import { Link } from "react-router-dom";
import { LOGO_DARK } from "../../lib/assets";

export const FooterOne = () => {
  return (
    <footer>
      <div className="footer-area footer-bg">
        <div className="container">
          <div className="footer-top">
            <div className="row">
              <div className="col-lg-3 col-md-7">
                <div className="footer-widget">
                  <h4 className="fw-title">Hotel Sircle</h4>
                  <div className="footer-info">
                    <ul className="list-wrap">
                      <li>
                        <div className="icon">
                          <i className="flaticon-pin"></i>
                        </div>
                        <div className="content">
                          <p>India's Premier Hospitality Leadership Platform</p>
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-mail"></i>
                        </div>
                        <div className="content">
                          <a href="mailto:connect@hotelsircle.in">
                            connect@hotelsircle.in
                          </a>
                        </div>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-phone-call"></i>
                        </div>
                        <div className="content">
                          <a href="tel:+919999999999">+91 99999 99999</a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-5 col-sm-6">
                <div className="footer-widget">
                  <h4 className="fw-title">Network</h4>
                  <div className="footer-link">
                    <ul className="list-wrap">
                      <li>
                        <Link to="/about">About Us</Link>
                      </li>
                      <li>
                        <Link to="/members">Members</Link>
                      </li>
                      <li>
                        <Link to="/events">Events</Link>
                      </li>
                      <li>
                        <Link to="/insights">Insights</Link>
                      </li>
                      <li>
                        <Link to="/contact">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-5 col-sm-6">
                <div className="footer-widget">
                  <h4 className="fw-title">Discover</h4>
                  <div className="footer-link">
                    <ul className="list-wrap">
                      <li>
                        <Link to="/feed">Industry Feed</Link>
                      </li>
                      <li>
                        <Link to="/investments">Investments</Link>
                      </li>
                      <li>
                        <Link to="/marketplace">Marketplace</Link>
                      </li>
                      <li>
                        <Link to="/register">Join Network</Link>
                      </li>
                      <li>
                        <Link to="/contact">Partnership</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="footer-widget">
                  <h4 className="fw-title">Stay Connected</h4>
                  <div className="footer-newsletter">
                    <p>
                      Get weekly hospitality industry insights, investment
                      opportunities, and network updates.
                    </p>
                    <form action="#">
                      <input type="email" placeholder="your email address" />
                      <button type="submit">Subscribe</button>
                    </form>
                    <span>Join 5,000+ hospitality leaders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="left-sider">
                  <div className="f-logo">
                    <Link to="/">
                      <img src={LOGO_DARK} alt="Hotel Sircle" style={{ maxHeight: "50px" }} />
                    </Link>
                  </div>
                  <div className="copyright-text">
                    <p>
                      Copyright © {new Date().getFullYear()} Hotel Sircle
                      | All Rights Reserved
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="footer-social">
                  <ul className="list-wrap">
                    <li>
                      <a href="#" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="Twitter">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#" aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
