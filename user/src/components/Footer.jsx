import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="section bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 text-center text-lg-start wow fadeInUp">
            <p className="mb-0 text-center text-lg-start">
              Developed by{" "}
              <a className="fw-600" href="https://www.rutvikjr.com/">
                RutvikJR
              </a>
            </p>
          </div>
          <div className="col-lg-6 wow fadeInUp">
            <p className="mb-0 text-center text-lg-end">
              Designed by{" "}
              <a className="fw-600" href="https://www.harnishdesign.net/">
                Harnish Design
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
