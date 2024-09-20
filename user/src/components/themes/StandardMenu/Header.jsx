import React, { useState } from "react";
import { Link } from "react-scroll";
import { scrollDuration } from "../../../config/commonConfig";
import { Tooltip } from "../../Tooltip";
import userStore from "../../../store";

const StandardMenuHeader = () => {
  const [isNavModalClose, setIsNavModalClose] = useState(true);

  const {
    skills,
    services,
    education,
    experience,
    testimonials,
    faqs,
    projects,
    userDetails,
    userSocials,
  } = userStore();

  return (
    <header id="header" className="sticky-top">
      {/* Navbar */}
      <nav className="primary-menu navbar navbar-expand-lg text-uppercase navbar-line-under-text fw-600">
        <div className="container position-relative">
          <div className="col-auto col-lg-2 d-inline-flex ps-lg-0">
            {/* Logo */}
            <Link
              className="logo"
              title="Callum"
              smooth="easeInOutQuint"
              duration={scrollDuration}
              style={{ cursor: "pointer" }}
              offset={-72}
              to="home"
              onClick={(e) => {
                e.preventDefault();
                setIsNavModalClose(true);
              }}
            >
              <img
                src={userDetails[0]?.logo || "images/logo.png"}
                style={{ height: "60px", width: "100px" }}
                alt="MyProfileSpace"
              />
            </Link>
            {/* Logo End */}
          </div>
          <div className="col col-lg-8 navbar-accordion px-0">
            <button
              className={
                "navbar-toggler ms-auto collapsed " +
                (isNavModalClose ? "" : "show")
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
                "collapse navbar-collapse justify-content-center " +
                (isNavModalClose ? "" : "show")
              }
            >
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
                    offset={-71}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsNavModalClose(true);
                    }}
                  >
                    Home
                  </Link>
                </li>
                {userDetails.length > 0 ? (
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
                      About
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
                {services.length > 0 ? (
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
                      Services
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
                {education.length > 0 ||
                experience.length > 0 ||
                skills.length > 0 ? (
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
                ) : (
                  <></>
                )}
                {projects.length > 0 ? (
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
                ) : (
                  <></>
                )}
                {faqs.length > 0 ? (
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
                ) : (
                  <></>
                )}
                {testimonials.length > 0 ? (
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
                      Client
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
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
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-auto col-lg-2 d-flex justify-content-end ps-0">
            <ul className="social-icons">
              {userSocials.length > 0 &&
                userSocials.map((item) => (
                  <li
                    className={item?.platform_socials?.li_class}
                    key={item.id}
                  >
                    <Tooltip
                      text={item?.platform_socials?.name}
                      placement="bottom"
                    >
                      <a
                        href="http://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className={item?.platform_socials?.fa_class} />
                      </a>
                    </Tooltip>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </nav>
      {/* Navbar End */}
    </header>
  );
};

export default StandardMenuHeader;
