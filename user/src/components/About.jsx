import React from "react";
import useStore from "../store";

const AboutUs = () => {
  const { userDetails } = useStore();

  if (userDetails.length === 0) {
    return null;
  }

  const user = userDetails[0];
  const hasExperience = user.years_of_experience > 0;

  return (
    <section id="about" className="section">
      <div className="container">
        {/* Heading */}
        <p className="text-center mb-2 wow fadeInUp">
          <span className="bg-primary text-dark px-2">About Me</span>
        </p>
        <h2 className="text-10 fw-600 text-center mb-5 wow fadeInUp">
          Know Me More
        </h2>
        {/* Heading end */}
        <div className="row">
          <div
            className={`col-lg-${
              hasExperience ? "8" : "12"
            } text-center text-lg-start wow fadeInUp`}
          >
            <h2 className="text-8 fw-400 mb-3">
              Hi, I'm{" "}
              <span className="fw-700 border-bottom border-3 border-primary">
                {user.first_name} {user.last_name}
              </span>
            </h2>
            <p className="text-5">{user.description}</p>
          </div>
          {hasExperience && (
            <div
              className="col-lg-4 mt-4 mt-lg-0 wow fadeInUp"
              data-wow-delay="0.2s"
            >
              <div className="featured-box style-4">
                <div className="featured-box-icon text-25 fw-500 bg-primary rounded-circle">
                  <span className="wow heartBeat" data-wow-delay="1.3s">
                    {user.years_of_experience}
                  </span>
                </div>
                <h3 className="text-7 wow rubberBand" data-wow-delay="2s">
                  Years of <span className="fw-700">Experience</span>
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="row gy-3 mt-4">
          {user?.first_name && user?.last_name && (
            <div
              className={`col-6 ${
                hasExperience ? "col-lg-3" : "col-lg-4"
              } wow fadeInUp`}
            >
              <p className="text-muted fw-500 mb-0">Name:</p>
              <p className="text-4 text-dark fw-600 mb-0">
                {user.first_name} {user.last_name}
              </p>
            </div>
          )}
          {user?.business_email && (
            <div
              className={`col-6 ${
                hasExperience ? "col-lg-3" : "col-lg-4"
              } wow fadeInUp`}
              data-wow-delay="0.2s"
            >
              <p className="text-muted fw-500 mb-0">Email:</p>
              <p
                className="text-4 fw-600 mb-0"
                style={{
                  wordBreak: "break-all",
                  whiteSpace: "normal",
                }}
              >
                <a
                  className="link-dark "
                  href={`mailto:${user.business_email}`}
                >
                  {user.business_email}
                </a>
              </p>
            </div>
          )}
          {user?.date_of_birth && (
            <div
              className={`col-6 ${
                hasExperience ? "col-lg-3" : "col-lg-4"
              } wow fadeInUp`}
              data-wow-delay="0.3s"
            >
              <p className="text-muted fw-500 mb-0">Date of Birth:</p>
              <p className="text-4 text-dark fw-600 mb-0">
                {user.date_of_birth}
              </p>
            </div>
          )}
          {user?.city && (
            <div
              className={`col-6 ${
                hasExperience ? "col-lg-3" : "col-lg-4"
              } wow fadeInUp`}
              data-wow-delay="0.4s"
            >
              <p className="text-muted fw-500 mb-0">From:</p>
              <p className="text-4 text-dark fw-600 mb-0">{`${user.city}, ${user.state}, ${user.country}`}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
