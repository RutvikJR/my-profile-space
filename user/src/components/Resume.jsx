import React from "react";
import resumeFile from "../documents/resume.pdf";
import userStore from "../store";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "short" };
  return date.toLocaleDateString(undefined, options);
};

const Resume = () => {
  const { education, experience, skills } = userStore();
  const educationExists = education.length > 0;
  const experienceExists = experience.length > 0;

  const columnClass =
    educationExists && experienceExists ? "col-lg-6" : "col-lg-12";

  if (!educationExists && !experienceExists && skills.length === 0) {
    return <></>;
  }

  return (
    <section id="resume" className="section">
      <div className="container">
        {/* Heading */}
        <p className="text-center mb-2 wow fadeInUp">
          <span className="bg-primary text-dark px-2">Resume</span>
        </p>
        <h2 className="text-10 fw-600 text-center mb-5 wow fadeInUp">
          A summary of My Resume
        </h2>
        {/* Heading end*/}

        <div className="row g-5 mt-5">
          {/* My Education */}
          {educationExists && (
            <div className={`${columnClass} wow fadeInUp`}>
              <h2 className="text-7 fw-600 mb-4 pb-2">My Education</h2>
              <div className="border-start border-2 border-primary ps-3">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-5">{edu.degree}</h3>
                    <p className="mb-2">
                      {edu.school} / {formatDate(edu.start_date)} -{" "}
                      {edu.is_present ? "Present" : formatDate(edu.end_date)}
                    </p>
                    <p className="text-muted">{edu.description}</p>
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* My Experience */}
          {experienceExists && (
            <div
              className={`${columnClass} wow fadeInUp`}
              data-wow-delay="0.2s"
            >
              <h2 className="text-7 fw-600 mb-4 pb-2">My Experience</h2>
              <div className="border-start border-2 border-primary ps-3">
                {experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="text-5">{exp.position}</h3>
                    <p className="mb-2">
                      {exp.company} / {formatDate(exp.start_date)} -{" "}
                      {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </p>
                    <p className="text-muted">{exp.description}</p>
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* My Skills */}
        {skills.length > 0 && (
          <>
            <h2 className="text-7 fw-600 mb-4 pb-2 mt-5 wow fadeInUp">
              My Skills
            </h2>
            <div className="row gx-5">
              {skills.map((skill, index) => (
                <div className="col-md-6 wow fadeInUp" key={index}>
                  <p className="fw-500 text-start mb-2">
                    {skill.name}{" "}
                    <span className="float-end">{skill.rating}/10</span>
                  </p>
                  <div className="progress progress-sm mb-4">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${skill.rating * 10}%` }}
                      aria-valuenow={skill.rating}
                      aria-valuemin={0}
                      aria-valuemax={5}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-center mt-5 wow fadeInUp">
          <a
            className="btn btn-outline-dark shadow-none rounded-0"
            href={resumeFile}
            download
          >
            Download CV
          </a>
        </p>
      </div>
    </section>
  );
};

export default Resume;
