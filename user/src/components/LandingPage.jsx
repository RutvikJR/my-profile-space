import React from "react";
import "./landing-page/assets/css/animate.css";
import "./landing-page/assets/css/LineIcons.2.0.css";
import "./landing-page/assets/css/main.scss";
import logoImg from "./landing-page/assets/images/logo/logo.svg";
import heroImg from "./landing-page/assets/images/hero/hero-image.svg";
import aboutImg from "./landing-page/assets/images/about/about-image.svg";
import ctaImg from "./landing-page/assets/images/cta/cta-image.svg";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="navbar-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg">
                  <a className="navbar-brand" href="index.html">
                    <img src={logoImg} alt="Logo" />
                  </a>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                  </button>

                  <div
                    className="collapse navbar-collapse sub-menu-bar"
                    id="navbarSupportedContent"
                  >
                    <div className="ms-auto">
                      <ul id="nav" className="navbar-nav ms-auto">
                        <li className="nav-item">
                          <a className="page-scroll active" href="#home">
                            Home
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#about">
                            About
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#features">
                            Features
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="" href="#0">
                            Pricing
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="" href="#0">
                            Team
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="header-btn">
                    <a href="#0" className="main-btn btn-hover">
                      Download
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6 col-md-10">
              <div className="hero-content">
                <h1>You are using free lite version of SaaSIntro</h1>
                <p>
                  Please, purchase full version of the template to get all
                  sections, elements and permission to remove footer credits.
                </p>
                <a href="#0" className="main-btn btn-hover">
                  Buy Now
                </a>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <div className="hero-image text-center text-lg-end">
                <img src={heroImg} alt="hero-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 order-last order-lg-first">
              <div className="about-image">
                <img src={aboutImg} alt="about-image" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content-wrapper">
                <div className="section-title">
                  <h2 className="mb-20">
                    Perfect Solution Thriving Online Business
                  </h2>
                  <p className="mb-30">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    dinonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                    sea takimata sanctus est Lorem.Lorem ipsum dolor sit amet.
                  </p>
                  <a href="#0" className="main-btn btn-hover border-btn">
                    Discover More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}

      <section id="features" className="feature-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-10">
              <div className="section-title mb-60">
                <h2 className="mb-20">Modern design with Essential Features</h2>
                <p>
                  Lorem ipsum dolor amet, consetetur sadipscing elitr, sed diam
                  nonumy eirmod te invidunt, Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-display"></i>
                    </div>
                    <div className="feature-content">
                      <h4>SaaS Focused</h4>
                      <p>
                        Lorem ipsum dolor amet, consetetur sadipscing elitr,
                        diam nonu eirmod tem invidunt.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-compass"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Awesome Design</h4>
                      <p>
                        Lorem ipsum dolor amet, consetetur sadipscing elitr,
                        diam nonu eirmod tem invidunt.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-grid-alt"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Ready to Use</h4>
                      <p>
                        Lorem ipsum dolor amet, consetetur sadipscing elitr,
                        diam nonu eirmod tem invidunt.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-layers"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Essential Sections</h4>
                      <p>
                        Lorem ipsum dolor amet, consetetur sadipscing elitr,
                        diam nonu eirmod tem invidunt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section pt-130 pb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-10">
              <div className="cta-content-wrapper">
                <div className="section-title">
                  <h2 className="mb-20">
                    Quick & Easy to <br className="d-none d-lg-block" /> Use
                    Bootstrap Template
                  </h2>
                  <p className="mb-30">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    dinonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et
                    justo duo dolores et ea rebum. Stet clita kasd gubergre.
                  </p>
                  <a href="#0" className="main-btn btn-hover border-btn">
                    Try it Free
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="cta-image text-lg-end">
                <img src={ctaImg} alt="cta-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer pt-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-10">
              <div className="footer-widget">
                <div className="logo">
                  <a href="index.html">
                    {" "}
                    <img src={logoImg} alt="logo" />{" "}
                  </a>
                </div>
                <p className="desc">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  dinonumy eirmod tempor invidunt.
                </p>
                <ul className="social-links">
                  <li>
                    <a href="#0">
                      <i className="lni lni-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#0">
                      <i className="lni lni-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#0">
                      <i className="lni lni-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#0">
                      <i className="lni lni-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 offset-xl-1">
              <div className="footer-widget">
                <h3>About Us</h3>
                <ul className="links">
                  <li>
                    <a href="#0">Home</a>
                  </li>
                  <li>
                    <a href="#0">About</a>
                  </li>
                  <li>
                    <a href="#0">Features</a>
                  </li>
                  <li>
                    <a href="#0">Pricing</a>
                  </li>
                  <li>
                    <a href="#0">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h3>Services</h3>
                <ul className="links">
                  <li>
                    <a href="#0">SaaS Focused</a>
                  </li>
                  <li>
                    <a href="#0">Awesome Design</a>
                  </li>
                  <li>
                    <a href="#0">Ready to Use</a>
                  </li>
                  <li>
                    <a href="#0">Essential Selection</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="footer-widget">
                <h3>Subscribe Newsletter</h3>
                <form action="#">
                  <input type="email" placeholder="Email" />
                  <button className="main-btn btn-hover">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Top Button */}
      <a href="#" className="scroll-top btn-hover">
        <i className="lni lni-chevron-up"></i>
      </a>
    </div>
  );
};

export default LandingPage;
