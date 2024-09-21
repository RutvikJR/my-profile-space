import WOW from "wowjs";
import AboutUs from "./components/About";
import Services from "./components/Services";
import Resume from "./components/Resume";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {appliedConfig} from "./config/commonConfig";
import { Tooltip } from "./components/Tooltip";
import CallToAction from "./components/CallToAction";
import FAQs from "./components/FAQs";
import StandardMenuHeader from "./components/themes/StandardMenu/Header";
import StandardMenuDefaultIntro from "./components/themes/StandardMenu/IntroDefault";
import StandardMenuImgBgIntro from "./components/themes/StandardMenu/IntroImageBg";
import StandardMenuVideoBgIntro from "./components/themes/StandardMenu/IntroVideoBg";
import userStore from "./store.js";

function FullTemplet() {
  const appliedIntro = appliedConfig.appliedIntro;
  const { slug } = useParams();
  const [userId, setUserId] = useState(null);

  const { userSettings, loadUserSettings, loadAllData } = userStore(
    (state) => ({
      skills: state.skills,
      services: state.services,
      education: state.education,
      experience: state.experience,
      faqs: state.faqs,
      testimonials: state.testimonials,
      projects: state.projects,
      userSocials: state.userSocials,
      platformSocials: state.platformSocials,
      userSettings: state.userSettings,
      loadUserSettings: state.loadUserSettings,
      loadAllData: state.loadAllData,
    })
  );

  useEffect(() => {
    loadUserSettings();
  }, []);

  useEffect(() => {
    if (userSettings && slug) {
      const matchingUser = userSettings.find(
        (setting) => setting.slug === slug
      );
      if (matchingUser) {
        setUserId(matchingUser.user_id);
      } else {
        setUserId(null);
      }
    }
  }, [slug, userSettings]);

  useEffect(() => {
    if (userId) {
      loadAllData(userId);
    }
  }, [userId, loadAllData]);

  const handleNavClick = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  const [scrollTopVisible, setScrollTopVisible] = useState(false);

  useEffect(() => {
    new WOW.WOW({
      live: false,
    }).init();
    loadAllData(userId);

    const checkScrollTop = () => {
      const scrollTop =
        document.body.scrollTop > 400 ||
        document.documentElement.scrollTop > 400;
      setScrollTopVisible(scrollTop);
    };

    window.addEventListener("scroll", checkScrollTop);

    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [userId, loadAllData]);

  const getHeader = () => {
    return <StandardMenuHeader />;
  };

  const getStandardMenuIntro = () => {
        return <StandardMenuDefaultIntro />;
  };

  return (
    <div style={{ position: "relative" }}>
      <div id="main-wrapper">
        {getHeader()}

        <div id="content" role="main">
          {getStandardMenuIntro()}
          <AboutUs />
          <Services />
          <Resume />
          <Portfolio />
          <CallToAction />
          <FAQs />
          <Testimonials />
          <Contact />
        </div>
        <Footer handleNavClick={handleNavClick} />
      </div>

      <Tooltip text="Back to Top" placement="left">
        <span
          id="back-to-top"
          className="rounded-circle"
          style={{ display: scrollTopVisible ? "inline" : "none" }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <i className="fas fa-arrow-up" />
        </span>
      </Tooltip>
    </div>
  );
}

export default FullTemplet;
