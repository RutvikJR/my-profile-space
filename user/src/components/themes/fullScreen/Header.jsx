import React, { useState } from "react";
import { Link } from "react-scroll";
import { scrollDuration } from "../../../config/commonConfig";
import { Tooltip } from "../../Tooltip";

const FullScreenHeader = ({ textWhite }) => {
  const [stickyHeader, setStickyHeader] = useState(false);
  const [isNavModalClose, setIsNavModalClose] = useState(true);

  const checkScrollTop = () => {
    let header = document.getElementsByClassName("primary-menu");

    if (header) {
      if (
        document.body.scrollTop > 1 ||
        document.documentElement.scrollTop > 1
      ) {
        setStickyHeader(true);
      } else {
        setStickyHeader(false);
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", checkScrollTop);
  }

  return (
    <header id="header" className="sticky-top">
      {/* Navbar */}
      <nav
        className={
          "primary-menu navbar navbar-expand-none navbar-overlay  bg-transparent border-bottom-0 text-5 fw-600 " +
          (stickyHeader ? "sticky-on-top " : " ") +
          (textWhite
            ? "navbar-overlay navbar-text-light"
            : "navbar-overlay-dark")
        }
      >
        <div className="container">
          {/* Logo */}
          <Link
            className="logo"
            title="Callum"
            smooth="easeInOutQuint"
            duration={scrollDuration}
            style={{ cursor: "pointer" }}
            to="home"
            onClick={(e) => {
              e.preventDefault();
              setIsNavModalClose(true);
            }}
          >
            <img
              src={textWhite ? "images/logo-light.png" : "images/logo.png"}
              alt="Callum"
            />
          </Link>
          {/* Logo End */}
          <div
            className={"text-3 ms-auto me-2 " + (textWhite ? "text-white" : "")}
          >
            <span className="text-4 me-2">
              <i className="fas fa-phone" />
            </span>
            (060) 444 434 444
          </div>
          <button
            className={
              "navbar-toggler collapsed " + (isNavModalClose ? "" : "show")
            }
            type="button"
            onClick={() => setIsNavModalClose(!isNavModalClose)}
          >
            <span />
            <span />
            <span />
          </button>
          <div
            id="header-nav"
            className={
              "collapse navbar-collapse " + (isNavModalClose ? "" : "show")
            }
          >
            <div className="d-flex flex-column h-100 align-items-center justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="home"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="about"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    About Me
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="services"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    What I Do
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="resume"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    Resume
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="portfolio"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    Portfolio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="faq"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    FAQ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="testimonial"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    Client Speak
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link "
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    activeClass="active"
                    spy
                    to="contact"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    Contact Me
                  </Link>
                </li>
              </ul>
              <ul className="social-icons social-icons-light social-icons-lg social-icons-light d-inline-flex mt-4">
                <li className="social-icons-twitter">
                  <Tooltip text="Twitter" placement="top">
                    <a
                      href="https://twitter.com/harnishdesign/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-twitter" />
                    </a>
                  </Tooltip>
                </li>
                <li className="social-icons-facebook">
                  <Tooltip text="Facebook" placement="top">
                    <a
                      href="http://www.facebook.com/harnishdesign/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-facebook" />
                    </a>
                  </Tooltip>
                </li>
                <li className="social-icons-instagram">
                  <Tooltip text="Instagram" placement="top">
                    <a
                      href="http://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-instagram" />
                    </a>
                  </Tooltip>
                </li>
                <li className="social-icons-linkedin">
                  <Tooltip text="Linkedin" placement="top">
                    <a
                      href="http://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-linkedin-in" />
                    </a>
                  </Tooltip>
                </li>
                <li className="social-icons-dribbble">
                  <Tooltip text="Dribbble" placement="top">
                    <a
                      href="http://www.dribbble.com/harnishdesign/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-dribbble" />
                    </a>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* Navbar End */}
    </header>
  );
};

export default FullScreenHeader;
