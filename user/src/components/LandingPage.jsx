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
      <header className="header" >
        <div className="navbar-area" style={{ paddingLeft: '4rem' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg">
                  <a className="navbar-brand" href="index.html">
                    <h2 style={{ color: '#37c2cc' }}>My Profile Space</h2>
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
                            Team
                          </a>
                        </li>
                        {/*<li className="nav-item">
                          <a className="" href="#0">
                            Team
                          </a>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                  {/* <div className="header-btn">
                    <a href="#0" className="main-btn btn-hover">
                      Download
                    </a>
                  </div> */}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section" style={{ paddingLeft: '4rem' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-lg-6 col-md-10">
              <div className="hero-content">
                <h1>Showcase Your Talent, Effortlessly</h1>
                <p>
                  MyProfileSpace gives you the tools to create a stunning portfolio that stands out. Choose from beautiful templates, customize your content, and generate a shareable link in just a few clicks.
                </p>
                <a href="https://www.app.myprofilespace.com" className="main-btn btn-hover">
                  Try Now
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
      <section id="about" className="about-section" style={{ paddingLeft: '4rem' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 order-last order-lg-first">
              <div className="about-image">
                <img src={aboutImg} alt="about-image" style={{ paddingLeft: '4rem' }} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content-wrapper">
                <div className="section-title">
                  <h2 className="mb-20">
                    A Portfolio Solution for Everyone
                  </h2>
                  <p className="mb-30">
                    MyProfileSpace is your go-to platform for creating personalized and professional portfolios. We know that presenting your work online should be both easy and impactful, which is why we offer an intuitive interface, mobile-friendly templates, and customizable features to suit your style. Our mission is to empower professionals with the tools to craft a compelling digital presence that stands out. No coding, no hassle just your story, beautifully presented.
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}

      <section id="features" className="feature-section" style={{ paddingLeft: '4rem' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-10">
              <div className="section-title mb-60">
                <h2 className="mb-20">Modern design with Essential Features</h2>
                <p>
                  MyProfileSpace combines sleek, modern design with all the essential features you need to create a professional portfolio. Each template is crafted with attention to detail, ensuring that your portfolio not only looks visually stunning but also functions seamlessly. From easy customization options to responsive layouts that adapt to any device, our platform prioritizes both aesthetics and usability. Whether you’re updating your achievements or sharing your latest projects, our feature-rich templates ensure your digital presence stays polished and up-to-date effortlessly.
                </p>
              </div>
            </div>

            <div className="col-lg-7" style={{ paddingLeft: "2rem" }}>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-layers"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Easy Customization</h4>
                      <p>
                        Personalize your portfolio with ease. Add your bio, work experience, projects, and social links, and adjust the design to reflect your brand.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-link"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Instant Public Link</h4>
                      <p>
                        Generate a shareable link to your portfolio with just one click. Showcase your work to potential clients, employers, or peers anywhere online.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-mobile"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Mobile-Friendly Design</h4>
                      <p>
                        All our templates are fully responsive, ensuring your portfolio looks great on any device-desktop, tablet, or mobile.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="single-feature">
                    <div className="feature-icon">
                      <i className="lni lni-pencil-alt"></i>
                    </div>
                    <div className="feature-content">
                      <h4>Easy Updates</h4>
                      <p>
                        Quickly update your portfolio anytime to reflect new projects, achievements, or changes in your career.
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
      <section id="cta" className="cta-section pt-130 pb-100" style={{ paddingLeft: '4rem' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-10">
              <div className="cta-content-wrapper">
                <div className="section-title">
                  <h2 className="mb-20">
                    Quick & Easy to  Use
                    Predefined Template
                  </h2>
                  <p className="mb-30">
                    At MyProfileSpace, we make it simple to get started with your portfolio. Our predefined templates are carefully designed to suit a wide range of industries and styles. You don’t need to worry about design or layout just add your content, and you're ready to go. Whether you’re an artist, developer, or business professional, our templates provide a clean, modern foundation that lets your work shine. With minimal effort, you can create a professional portfolio that highlights your talent and achievements in no time.
                  </p>
                  <a href="https://www.app.myprofilespace.com" className="main-btn btn-hover border-btn">
                    Try it Now
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
      <footer className="footer pt-120" style={{ padding: '2rem 4rem' }}>
        <div className="logo" style={{ paddingLeft: '35%' }}>
          <h2 style={{ color: '#37c2cc' }}>My Profile Space</h2>
        </div>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Section 1: Logo and Description */}


          {/* Section 2: About Us Links */}
          <div className="footer-widget" style={{ flex: '1 1 30%', marginBottom: '1.5rem', paddingRight: '5%', paddingLeft: '10%' }}>
            <h3 style={{ color: 'black', fontSize: '30px' }}>About Us</h3>
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
                <a href="#0">Team</a>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Form */}
          <div className="footer-widget" style={{ flex: '1 1 30%', marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'black', fontSize: '30px' }}>Contact us</h3>
            <form action="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="email"
                placeholder="Email"
                className=""
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <button
                className="main-btn btn-hover"
                style={{ width: '22%', padding: '0.5rem', backgroundColor: '#37c2cc', color: 'white', borderRadius: '5px', textAlign: 'center' }}>
                Connect
              </button>
            </form>
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
