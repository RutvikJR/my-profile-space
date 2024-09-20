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
import {
  appliedConfig,
  introBackgroundConfig,
  themeConfig,
} from "./config/commonConfig";
import { Tooltip } from "./components/Tooltip";
import CallToAction from "./components/CallToAction";
import FAQs from "./components/FAQs";
import FullScreenVideoBgIntro from "./components/themes/fullScreen/IntroVideoBg";
import FullScreenHeader from "./components/themes/fullScreen/Header";
import FullScreenDefaultIntro from "./components/themes/fullScreen/IntroDefault";
import FullScreenImgBgIntro from "./components/themes/fullScreen/IntroImageBg";
import BottomHeader from "./components/themes/bottomHeader/Header";
import StandardMenuHeader from "./components/themes/StandardMenu/Header";
import BottomHeaderDefaultIntro from "./components/themes/bottomHeader/IntroDefault";
import BottomHeaderImgBgIntro from "./components/themes/bottomHeader/IntroImageBg";
import BottomHeaderVideoBgIntro from "./components/themes/bottomHeader/IntroVideoBg";
import StandardMenuDefaultIntro from "./components/themes/StandardMenu/IntroDefault";
import StandardMenuImgBgIntro from "./components/themes/StandardMenu/IntroImageBg";
import StandardMenuVideoBgIntro from "./components/themes/StandardMenu/IntroVideoBg";
import userStore from "./store.js";

function FullTemplet() {
  const appliedTheme = appliedConfig.appliedTheme;
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

  // Load user settings on component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  // Set userId based on the slug
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

  // Load all data when userId changes
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
    // Initialize WOW.js for animations
    new WOW.WOW({
      live: false,
    }).init();
    console.log(userId);

    loadAllData(userId);

    // Scroll listener to manage back-to-top button visibility
    const checkScrollTop = () => {
      const scrollTopBtn = document.getElementById("back-to-top");
      if (scrollTopBtn) {
        const scrollTop =
          document.body.scrollTop > 400 ||
          document.documentElement.scrollTop > 400;
        setScrollTopVisible(scrollTop);
      }
    };

    window.addEventListener("scroll", checkScrollTop);

    // Cleanup scroll listener on component unmount
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, []);

  const getHeader = () => {
    switch (appliedTheme) {
      case themeConfig.BottomHeader:
        return <BottomHeader />;
      case themeConfig.FullScreenMenu:
        return (
          <FullScreenHeader
            textWhite={appliedIntro === introBackgroundConfig.image}
          />
        );
      default:
        return <StandardMenuHeader />;
    }
  };

  const getIntroComponent = () => {
    switch (appliedTheme) {
      case themeConfig.BottomHeader:
        switch (appliedIntro) {
          case introBackgroundConfig.default:
            return <BottomHeaderDefaultIntro />;
          case introBackgroundConfig.image:
            return <BottomHeaderImgBgIntro />;
          default:
            return <BottomHeaderVideoBgIntro />;
        }
      case themeConfig.FullScreenMenu:
        switch (appliedIntro) {
          case introBackgroundConfig.default:
            return <FullScreenDefaultIntro />;
          case introBackgroundConfig.image:
            return <FullScreenImgBgIntro />;
          default:
            return <FullScreenVideoBgIntro />;
        }
      default:
        switch (appliedIntro) {
          case introBackgroundConfig.default:
            return <StandardMenuDefaultIntro />;
          case introBackgroundConfig.image:
            return <StandardMenuImgBgIntro />;
          default:
            return <StandardMenuVideoBgIntro />;
        }
    }
  };

  const getBottomHeaderIntro = () => {
    if (appliedIntro === introBackgroundConfig.default) {
      return <BottomHeaderDefaultIntro></BottomHeaderDefaultIntro>;
    } else if (appliedIntro === introBackgroundConfig.image) {
      return <BottomHeaderImgBgIntro></BottomHeaderImgBgIntro>;
    } else {
      return <BottomHeaderVideoBgIntro></BottomHeaderVideoBgIntro>;
    }
  };

  const getFullScreenIntro = () => {
    if (appliedIntro === introBackgroundConfig.default) {
      return <FullScreenDefaultIntro></FullScreenDefaultIntro>;
    } else if (appliedIntro === introBackgroundConfig.image) {
      return <FullScreenImgBgIntro></FullScreenImgBgIntro>;
    } else {
      return <FullScreenVideoBgIntro></FullScreenVideoBgIntro>;
    }
  };

  const getStandardMenuIntro = () => {
    if (appliedIntro === introBackgroundConfig.default) {
      return <StandardMenuDefaultIntro></StandardMenuDefaultIntro>;
    } else if (appliedIntro === introBackgroundConfig.image) {
      return <StandardMenuImgBgIntro></StandardMenuImgBgIntro>;
    } else {
      return <StandardMenuVideoBgIntro></StandardMenuVideoBgIntro>;
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div id="main-wrapper">
        {appliedTheme === themeConfig.BottomHeader && getBottomHeaderIntro()}
        {getHeader()}

        <div id="content" role="main">
          {appliedTheme === themeConfig.FullScreenMenu && getFullScreenIntro()}
          {appliedTheme === themeConfig.StandardMenu && getStandardMenuIntro()}

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

      {/* Back to top button */}
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
