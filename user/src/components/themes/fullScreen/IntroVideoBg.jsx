import React from "react";
import videobg from "../../../videos/home.mp4";
import Typewriter from "typewriter-effect";
import { Link } from "react-scroll";
import { scrollDuration } from "../../../config/commonConfig";

const FullScreenVideoBgIntro = () => {
  return (
    <section id="home">
      <div className="hero-wrap">
        <div className="hero-mask opacity-8 bg-primary" />
        <div className="player hero-bg ">
          <video
            src={videobg}
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100vh",
              minHeight: "100%",
              objectFit: "cover",
            }}
          ></video>
        </div>
        <div className="hero-content py-5 d-flex fullscreen">
          <div className="container my-auto py-4">
            <div className="row">
              <div className="col-lg-7 text-center text-lg-start align-self-center order-1 order-lg-0">
                <h1 className="text-12 fw-300 mb-0 text-uppercase">
                  Hi, I'm a Freelancer
                </h1>
                <h2 className="text-21 fw-600 text-uppercase mb-0 ms-n1">
                  <Typewriter
                    options={{
                      strings: ["Designer", "Developer", "Callum"],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </h2>
                <p className="text-5">based in Los Angeles, USA.</p>
                <Link
                  className="btn btn-dark rounded-0 smooth-scroll mt-3"
                  smooth="easeInOutQuint"
                  duration={scrollDuration}
                  style={{ cursor: "pointer" }}
                  to="portfolio"
                >
                  View My Works
                </Link>
                <Link
                  className="btn btn-link text-dark smooth-scroll mt-3"
                  smooth="easeInOutQuint"
                  duration={scrollDuration}
                  style={{ cursor: "pointer" }}
                  to="contact"
                >
                  Contact Me
                  <span className="text-4 ms-2">
                    <i className="far fa-arrow-alt-circle-down" />
                  </span>
                </Link>
              </div>
              <div className="col-lg-5 text-center align-self-center mb-4 mb-lg-0 order-0 order-lg-1">
                <div className="bg-light rounded-pill d-inline-block p-3 shadow-lg wow zoomIn">
                  <img
                    className="img-fluid rounded-pill d-block"
                    src="images/web-developer.jpg"
                    title="I'm Callum"
                    alt="I'm David"
                  />
                </div>
              </div>
            </div>
          </div>
          <Link
            className="scroll-down-arrow text-dark smooth-scroll"
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
      </div>
    </section>
  );
};

export default FullScreenVideoBgIntro;
