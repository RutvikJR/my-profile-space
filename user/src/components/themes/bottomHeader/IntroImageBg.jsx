import React from "react";
import { Link } from "react-scroll";
import { Parallax } from "react-parallax";

import { scrollDuration } from "../../../config/commonConfig";

const BottomHeaderImgBgIntro = () => {
  return (
    <section id="home">
      <div className="hero-wrap">
        <div className="hero-mask opacity-8 bg-dark" />
        <Parallax
          bgImage="images/intro-bg.jpg"
          bgImageAlt="Intro"
          strength={200}
        >
          <div className="hero-content d-flex flex-column fullscreen py-5">
            <div className="container my-auto">
              <div className="row">
                <div className="col-lg-10 mx-auto text-center">
                  <div className="bg-white shadow rounded-pill p-2 mb-4 d-inline-block wow zoomIn">
                    {" "}
                    <img
                      className="img-fluid rounded-pill d-block"
                      src="images/web-developer-sm.jpg"
                      title="I'm David"
                      alt="I'm David"
                    />{" "}
                  </div>
                  <h2 className="text-10 text-white text-uppercase fw-600 mb-4 wow fadeInUp">
                    Hello! I'm Callum Smith - Graphic Designer, Illustrator
                    &amp; Art Director.
                  </h2>
                  <p className="text-5 text-light pb-3 wow fadeInUp">
                    based in Los Angeles, USA.
                  </p>
                  <Link
                    className="btn btn-primary rounded-0 smooth-scroll wow fadeInUp"
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    to="about"
                  >
                    About Me
                  </Link>
                </div>
              </div>
            </div>
            <div className="container py-2 text-center">
              {" "}
              <Link
                className="scroll-down-arrow text-white smooth-scroll"
                smooth="easeInOutQuint"
                duration={scrollDuration}
                style={{ cursor: "pointer" }}
                to="about"
              >
                <span className="animated">
                  <i className="fas fa-arrow-down" />
                </span>
              </Link>{" "}
            </div>
          </div>
        </Parallax>
      </div>
    </section>
  );
};

export default BottomHeaderImgBgIntro;
