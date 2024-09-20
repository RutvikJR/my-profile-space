import React from "react";
import userStore from "../store";
import Slider from "react-slick";

const Testimonials = () => {
  const { testimonials } = userStore();

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <i className="fa fa-chevron-left"></i>
    </button>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <i className="fa fa-chevron-right"></i>
    </button>
  );

  var settings = {
    dots: true,
    arrows: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
  };
  if (testimonials.length === 0) {
    return <></>;
  }
  return (
    <section id="testimonial" className="section bg-secondary">
      <div className="container">
        {/* Heading */}
        <p className=" text-center mb-2 wow fadeIn">
          <span className="bg-primary text-dark px-2">Client Speak</span>
        </p>
        <h2 className="text-10 fw-600 text-white text-center mb-5 wow fadeIn">
          What Some of my Clients Say
        </h2>

        {/* Heading end*/}
        <div className="row">
          <div className="col-lg-9 mx-auto wow fadeInUp">
            <Slider {...settings}>
              {testimonials.length > 0 &&
                testimonials.map((testimonial, index) => (
                  <div className="item text-center px-5" key={index}>
                    {" "}
                    <span className="text-9 text-primary">
                      <i className="fa fa-quote-start" />
                    </span>
                    <p className="text-5 text-white">{testimonial.review}</p>
                    {/* <img
                      className="img-fluid d-inline-block w-auto rounded-circle shadow"
                      src={testimonial.src}
                      alt={testimonial.is_male ? "male" : "female"}
                    />{" "} */}
                    <strong className="d-block text-3 fw-600 text-white">
                      {testimonial.name}
                    </strong>{" "}
                    <span className="text-light">{testimonial.position}</span>{" "}
                  </div>
                ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
