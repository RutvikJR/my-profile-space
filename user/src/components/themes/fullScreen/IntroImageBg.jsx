import React from "react";
import { Link } from "react-scroll";
import { Parallax } from "react-parallax";
import Typewriter from "typewriter-effect";
import { scrollDuration } from "../../../config/commonConfig";

const FullScreenImgBgIntro = () => {
  return (
    <section id="home">
      <div className="hero-wrap">
        <div className="hero-mask opacity-8 bg-dark" />
        <Parallax
          bgImage="images/intro-bg.jpg"
          bgImageAlt="Intro"
          strength={200}
        >
          <div className="hero-content d-flex fullscreen py-5">
            <div className="container my-auto py-4">
              <div className="row">
                <div className="col-lg-12 text-center order-1 order-lg-0">
                  <h1 className="text-8 text-white fw-400 mb-0 text-uppercase">
                    Hi, I'm a Freelancer
                  </h1>
                  <h2 className="text-23 text-white fw-600 text-uppercase mb-0 ms-n1">
                    <Typewriter
                      options={{
                        strings: ["Designer", "Developer", "Callum"],
                        autoStart: true,
                        loop: true,
                      }}
                    />{" "}
                  </h2>
                  <p className="text-5 text-light">
                    based in Los Angeles, USA.
                  </p>
                  <Link
                    className="btn btn-primary fw-600 rounded-0 smooth-scroll mt-3"
                    smooth="easeInOutQuint"
                    duration={scrollDuration}
                    style={{ cursor: "pointer" }}
                    to="portfolio"
                  >
                    View My Works
                  </Link>
                </div>
              </div>
            </div>
            <Link
              className="scroll-down-arrow text-light smooth-scroll"
              smooth="easeInOutQuint"
              duration={scrollDuration}
              style={{ cursor: "pointer" }}
              to="about"
            >
              <span className="animated">
                <i className="fas fa-arrow-down" />
              </span>
            </Link>
          </div>
        </Parallax>
      </div>
    </section>
  );
};

export default FullScreenImgBgIntro;
