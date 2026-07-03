import React from "react";

export const ContactAreaInner = () => {
  return (
    <section className="inner-contact-area pt-120 pb-120">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div style={{ background: "var(--tg-primary-color)", padding: "48px", marginBottom: "30px" }}>
              <h2 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "32px", fontWeight: 600, color: "#C6A962", marginBottom: "24px" }}>Get in Touch</h2>
              <p style={{ color: "#8DA4BE", fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
                Whether you're a hotel owner looking to join, an investor seeking opportunities,
                or a vendor wanting to list your services — we're here to help.
              </p>
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Email</h5>
                <a href="mailto:connect@hotelsircle.in" style={{ color: "#C6A962", textDecoration: "none", fontSize: "15px" }}>connect@hotelsircle.in</a>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <h5 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Phone</h5>
                <a href="tel:+919999999999" style={{ color: "#C6A962", textDecoration: "none", fontSize: "15px" }}>+91 99999 99999</a>
              </div>
              <div>
                <h5 style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Location</h5>
                <p style={{ color: "#8DA4BE", fontSize: "15px", margin: 0 }}>Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div style={{ padding: "0 0 0 30px" }}>
              <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "28px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "24px" }}>Send Us a Message</h3>
              <form action="#">
                <div className="row">
                  <div className="col-md-6" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>First Name</label>
                    <input type="text" placeholder="First Name" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--tg-border-color)", fontSize: "14px", outline: "none" }} />
                  </div>
                  <div className="col-md-6" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Last Name</label>
                    <input type="text" placeholder="Last Name" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--tg-border-color)", fontSize: "14px", outline: "none" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label>
                  <input type="email" placeholder="you@example.com" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--tg-border-color)", fontSize: "14px", outline: "none" }} />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>I am a...</label>
                  <select style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--tg-border-color)", fontSize: "14px", outline: "none", background: "#FFFFFF" }}>
                    <option value="">Select your role</option>
                    <option value="owner">Hotel Owner / Developer</option>
                    <option value="investor">Investor</option>
                    <option value="vendor">Service Provider / Vendor</option>
                    <option value="professional">Hospitality Professional</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Message</label>
                  <textarea placeholder="How can we help?" rows="5" style={{ width: "100%", padding: "14px 16px", border: "1px solid var(--tg-border-color)", fontSize: "14px", outline: "none", resize: "vertical" }}></textarea>
                </div>
                <button type="submit" className="btn" style={{ padding: "14px 32px", fontSize: "13px", letterSpacing: "1.5px" }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
