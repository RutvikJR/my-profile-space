import React from "react";
import { Link } from "react-scroll";
import { scrollDuration } from "../../../config/commonConfig";

const BottomHeaderDefaultIntro = () => {
  return (
    <section
      id="home"
      className="bg-primary d-flex flex-column fullscreen py-5 position-relative"
    >
      <div className="container my-auto">
        <div className="row">
          <div className="col-lg-10 mx-auto text-center">
            <div className="bg-white shadow rounded-pill p-2 mb-4 d-inline-block wow zoomIn">
              <img
                className="img-fluid rounded-pill d-block"
                src="images/web-developer-sm.jpg"
                title="I'm David"
                alt="David"
              />
            </div>
            <h2 className="text-10 text-uppercase fw-600 mb-4 wow fadeInUp">
              Hello! I'm Callum Smith - Graphic Designer, Illustrator &amp; Art
              Director.
            </h2>
            <p className="text-5 pb-3 wow fadeInUp">
              based in Los Angeles, USA.
            </p>
            <Link
              className="btn btn-dark rounded-0 smooth-scroll wow fadeInUp"
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
    </section>
  );
};

export default BottomHeaderDefaultIntro;
