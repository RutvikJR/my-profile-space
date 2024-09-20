import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "./Tooltip";
import userStore from "../store";

const Contact = () => {
  const form = useRef();
  const [sendingMail, setSendingMail] = useState(false);

  const [userData, setUserData] = useState(null); // State to hold the user data

  const { userSocials, userDetails, id } = userStore();

  useEffect(() => {
    // Find the specific user data based on the id
    if (userDetails && id) {
      const user = userDetails.find((user) => user.user_id === id);
      setUserData(user || null); // If no user is found, set to null
    }
  }, [userDetails, id]);

  const sendEmail = (e) => {
    e.preventDefault();
    setSendingMail(true);
    emailjs
      .sendForm(
        "service_i86k3ms",
        "template_si6cin9",
        form.current,
        "c9HsDgGF0tvWyVnAL"
      )
      .then(
        (result) => {
          document.getElementById("contact-form").reset();
          toast.success("Message sent successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log(result.text);
          setSendingMail(false);
        },
        (error) => {
          toast.error("Something went wrong!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log(error.text);
          setSendingMail(false);
        }
      );
  };

  return (
    <section id="contact" className="section bg-primary">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 text-center text-lg-start wow fadeInUp">
            <h2 className="text-10 fw-600 mb-5">Let's get in touch</h2>

            {userData?.location ? (
              <>
                <h3 className="text-5 fw-600">Living In:</h3>
                <address className="text-4">
                  {userData ? userData.location : "Unknown Address"}
                </address>
              </>
            ) : (
              <></>
            )}
            {userData?.contact ? (
              <>
                <h3 className="text-5 fw-600">Call:</h3>
                <p className="text-4">{userData ? userData.contact : ""}</p>
              </>
            ) : (
              <></>
            )}
            {userData?.business_email ? (
              <>
                <h3 className="text-5 fw-600">Email:</h3>
                <p className="text-4">
                  {userData ? userData.business_email : ""}
                </p>
              </>
            ) : (
              <></>
            )}

            <ul className="social-icons social-icons-lg justify-content-center justify-content-lg-start mt-5">
              {userSocials.length > 0 ? (
                userSocials.map((item) => (
                  <li
                    className={item?.platform_socials?.li_class}
                    key={item.id}
                  >
                    <Tooltip
                      text={
                        item?.platform_socials?.name
                          ? item?.platform_socials?.name
                          : "Unknown"
                      }
                      placement="top"
                    >
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className={
                            item?.platform_socials?.fa_class
                              ? item?.platform_socials?.fa_class
                              : "default-icon-class"
                          }
                        />
                      </a>
                    </Tooltip>
                  </li>
                ))
              ) : (
                <li>No social links available</li>
              )}
            </ul>
          </div>
          <div
            className="col-lg-6 ms-auto mt-5 mt-lg-0 wow fadeInUp"
            data-wow-delay="0.3s"
          >
            <h2 className="text-10 fw-600 text-center text-lg-start mb-5">
              Estimate your Project?
            </h2>
            {/* Contact Form */}
            <form
              id="contact-form"
              className="form-border"
              method="post"
              ref={form}
              onSubmit={sendEmail}
            >
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label" htmlFor="name">
                    What is Your Name:
                  </label>
                  <input
                    id="name"
                    name="user_name"
                    type="text"
                    className="form-control py-1"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="email">
                    Your Email Address:
                  </label>
                  <input
                    id="email"
                    name="user_email"
                    type="email"
                    className="form-control py-1"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="form-message">
                    How can I Help you?:
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    className="form-control py-1"
                    rows={4}
                    required
                    defaultValue={""}
                  />
                </div>
                <div className="col-12 text-center text-lg-start">
                  <button
                    id="submit-btn"
                    className="btn btn-dark rounded-0"
                    type="submit"
                  >
                    {sendingMail ? (
                      <>
                        <span
                          role="status"
                          aria-hidden="true"
                          className="spinner-border spinner-border-sm align-self-center me-2"
                        ></span>
                        Sending......
                      </>
                    ) : (
                      <>
                        Send{" "}
                        <span className="ms-3">
                          <i className="fas fa-arrow-right" />
                        </span>
                      </>
                    )}
                  </button>
                </div>
                <ToastContainer />
              </div>
            </form>
            {/* Contact Form end */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
