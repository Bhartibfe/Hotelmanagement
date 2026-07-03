import React from "react";
import { Link } from "react-router-dom";
import { LOGO } from "../../lib/assets";

export const FooterTwo = () => {
  return (
    <footer>
      <div className="footer-area-two footer-bg-two">
        <div className="footer-top-two">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-7">
                <div className="footer-widget">
                  <div className="fw-logo">
                    <Link to="/">
                      <img src={LOGO} alt="" />
                    </Link>
                  </div>

                  <div className="footer-content">
                    <p>
                      When an unknown printer took a galley of type aawer awtnd
                      scrambled it to make a type specimen book.
                    </p>
                    <div className="footer-info">
                      <ul className="list-wrap">
                        <li>
                          <div className="icon">
                            <i className="flaticon-phone-call"></i>
                          </div>
                          <div className="content">
                            <a href="tel:0123456789">+123 888 9999</a>
                          </div>
                        </li>
                        <li>
                          <div className="icon">
                            <i className="flaticon-clock"></i>
                          </div>
                          <div className="content">
                            <p>
                              Mon – Sat: 8 am – 5 pm, <br />
                              Sunday: <span>CLOSED</span>
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-5 col-sm-6">
                <div className="footer-widget">
                  <h4 className="fw-title">Menu</h4>
                  <div className="footer-link">
                    <ul className="list-wrap">
                      <li>
                        <Link to="/about">Company</Link>
                      </li>
                      <li>
                        <Link to="/contact">Careers</Link>
                      </li>
                      <li>
                        <Link to="/contact">Press media</Link>
                      </li>
                      <li>
                        <Link to="/blog">Our Blog</Link>
                      </li>
                      <li>
                        <Link to="/contact">Privacy Policy</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-5 col-sm-6">
                <div className="footer-widget">
                  <h4 className="fw-title">Quick Links</h4>
                  <div className="footer-link">
                    <ul className="list-wrap">
                      <li>
                        <Link to="/contact">How it’s Work</Link>
                      </li>
                      <li>
                        <Link to="/contact">Partners</Link>
                      </li>
                      <li>
                        <Link to="/contact">Testimonials</Link>
                      </li>
                      <li>
                        <Link to="/contact">Case Studies</Link>
                      </li>
                      <li>
                        <Link to="/contact">Pricing</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7">
                <div className="footer-widget">
                  <h4 className="fw-title">Our Newsletter</h4>
                  <div className="footer-newsletter">
                    <p>
                      Sign up to Privitar’s weekly newsletter to get the latest
                      updates.
                    </p>
                    <form action="#">
                      <input type="email" placeholder="enter your e-mail" />
                      <button type="submit">Subscribe</button>
                    </form>
                    <div className="footer-social footer-social-two">
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
                        <li>
                          <a href="#">
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
        </div>

        <div className="footer-bottom-two">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="copyright-text-two text-center">
                  <p>Copyright © gerow | All Right Reserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
