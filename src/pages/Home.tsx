import { useEffect } from "react";
import userStore from "../store/userStore";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Testimonials from "./Testimonials";
import FAQs from "./FAQs";
import Services from "./Services";

const Home = () => {
  const {
    loadFaqs,
    loadServices,
    loadSkills,
    loadExperience,
    loadEducation,
    loadProjects,
    loadTestimonials,
  } = userStore();

  useEffect(() => {
    loadSkills();
    loadExperience();
    loadEducation();
    loadFaqs();
    loadServices();
    loadTestimonials();
    loadProjects();
  }, []);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
