import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import { SERVICES_DETAILS01 } from "../../lib/assets";

export const ServicesDetailsSidebar = ({
  hideContact = false,
  hideTitle = false,
}) => {
  const services = [
    { label: "business Analysis", href: "/services-details" },
    { label: "Tax Strategy", href: "/services-details" },
    { label: "Financial Advisory", href: "/services-details" },
    { label: "business Growth", href: "/services-details" },
    { label: "Innovation Idea", href: "/services-details" },
    { label: "Market Research", href: "/services-details" },
  ];

  return (
    <aside className="services-sidebar">
      {/* Our Services */}
      {hideTitle ? (
        <div className="services-cat-list mb-30">
          <ul className="list-wrap">
            {services.map((item, idx) => (
              <li key={item.label} className={cn({ active: idx == 0 })}>
                <Link to={item.href}>
                  {item.label} <i className="flaticon-right-arrow"></i>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="services-widget">
          <h4 className="sw-title">Our Services</h4>
          <div className="services-cat-list">
            <ul className="list-wrap">
              {services.map((item, idx) => (
                <li key={item.label} className={cn({ active: idx == 0 })}>
                  <Link to={item.href}>
                    {item.label} <i className="flaticon-right-arrow"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Brochure */}
      <div className="services-widget">
        <h4 className="sw-title">Brochure</h4>
        <div className="services-brochure-wrap">
          <p>when an unknown printer took ga lley offer typey anddey.</p>
          <a
            href={SERVICES_DETAILS01}
            target="_blank"
            download
            className="download-btn"
          >
            <i className="far fa-file-pdf"></i>PDF. Download
          </a>
          <a
            href={SERVICES_DETAILS01}
            target="_blank"
            download
            className="download-btn"
          >
            <i className="far fa-file-alt"></i>DOC. Download
          </a>
        </div>
      </div>

      {/* contact */}
      {hideContact ? null : (
        <div className="services-widget services-sidebar-contact">
          <h4 className="title">If You Need Any Help Contact With Us</h4>
          <a href="tel:0123456789">
            <i className="flaticon-phone-call"></i> +91 705 2101 786
          </a>
        </div>
      )}

      {/* Get A Free Quote */}
      <div className="services-widget">
        <h4 className="sw-title">Get a Free Quote</h4>
        <div className="services-widget-form">
          <form action="#">
            <div className="form-grp">
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-grp">
              <input type="email" placeholder="E-mail Address" />
            </div>
            <div className="form-grp">
              <textarea
                name="message"
                placeholder="Type Your Message"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};
