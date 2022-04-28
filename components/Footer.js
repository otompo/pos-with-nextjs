import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="footer-container">
      {/* <section className="footer-subscription">
        <p className="footer-subscription-heading">
          Join the Adventure newsletter to receive our best vacation deals
        </p>
        <p className="footer-subscription-text">
          You can unsubscribe at any time.
        </p>
        <div className="input-areas">
          <form>
            <input
              className="footer-input"
              name="email"
              type="email"
              placeholder="Your Email"
            />
            
          </form>
        </div> 
      </section> */}
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link href="/">
              <a>Terms of Service</a>
            </Link>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link href="/contactus">
              <a>Contact</a>
            </Link>
            <Link href="/contactus">
              <a>Support</a>
            </Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Social Media</h2>

            <a target="_blank" href="https://web.facebook.com/afrotalian1">
              Facebook
            </a>
            <a target="_blank" href="https://web.facebook.com/afrotalian1">
              Instagram
            </a>
            <a target="_blank" href="https://web.facebook.com/afrotalian1">
              linkedIn
            </a>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link href="/" className="social-logo">
              <a>
                <img
                  width={150}
                  src="/img/logo.png"
                  alt="code smart websoft logo"
                  className="pb-1 ant-menu-item"
                />
              </a>
            </Link>
          </div>
          <small className="website-rights">
            Afrotalain © 2022 Inc. All rights reserved Powered by{' '}
            <a
              style={{ fontSize: 15 }}
              href="https://codesmartwebsoft.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              Code Smart Websoft
            </a>
          </small>
          <div className="social-icons">
            <a target="_blank" href="https://web.facebook.com/afrotalian1">
              <i className="fab fa-facebook-f" />
            </a>

            <a href="/" target="_blank">
              <i className="fab fa-instagram" />
            </a>

            <a href="/" target="_blank">
              <i className="fab fa-linkedin" />
            </a>
          </div>
        </div>
      </section>
      <div
        className="hanging-triangle"
        style={{ borderTop: '25px solid #fff' }}
      ></div>
    </div>
  );
};

export default Footer;
