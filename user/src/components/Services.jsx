import React from "react";
import userStore from "../store";

const Services = () => {
  const { services } = userStore();
  // console.log(services);
  if (services.length === 0) {
    return <></>;
  }
  return (
    <section id="services" className="section bg-light">
      <div className="container">
        {/* Heading */}
        <p className=" text-center mb-2 wow fadeInUp">
          <span className="bg-primary text-dark px-2">What I Do?</span>
        </p>
        <h2 className="text-10 fw-600 text-center mb-5 wow fadeInUp">
          How I can help your next project
        </h2>
        {/* Heading end*/}
        <div className="row gy-5 mt-5">
          {services.length > 0 &&
            services.map((service, index) => (
              <div className="col-sm-6 col-lg-4 wow fadeInUp" key={index}>
                <div className="featured-box text-center px-md-4">
                  {/* <div className="featured-box-icon text-primary text-13">
                    
                    <i className={service.icon} />
                  </div> */}
                  <div
                    style={{ fontWeight: "bold", opacity: 0.7 }}
                    className="featured-box-icon text-primary text-13"
                  >
                    <span>{index + 1}</span>
                  </div>
                  <h3 className="text-6 fw-600 mb-3">{service.name}</h3>
                  <p className="text-muted mb-0">{service.description} </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
