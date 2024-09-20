import React from "react";
import { Link } from "react-scroll";
import Typewriter from "typewriter-effect";
import { scrollDuration } from "../../../config/commonConfig";
import userStore from "../../../store";

const StandardMenuDefaultIntro = () => {
  const { userDetails, projects } = userStore();

  const user = userDetails[0];

  return (
    <section
      id="home"
      className="bg-primary d-flex fullscreen-with-header position-relative"
    >
      <div className="container my-auto py-5 py-lg-0">
        <div className="row py-4">
          <div className=" text-center  align-self-center order-1 order-lg-0">
            <h1 className="text-12 fw-300 mb-0 text-uppercase">
              Hi, I'm a {user?.designations}
            </h1>
            <h2 className="text-21 fw-600 text-uppercase mb-0 ms-n1">
              <Typewriter
                options={{
                  strings: [user?.designations, user?.first_name],
                  autoStart: true,
                  loop: true,
                }}
              />{" "}
            </h2>
            {user?.location && (
              <p className="text-5">based in {user?.location}</p>
            )}

            {projects?.length > 0 && (
              <Link
                className="btn btn-dark rounded-0 smooth-scroll mt-3"
                smooth="easeInOutQuint"
                duration={scrollDuration}
                style={{ cursor: "pointer" }}
                to="portfolio"
              >
                View My Works
              </Link>
            )}
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
    </section>
  );
};

export default StandardMenuDefaultIntro;
