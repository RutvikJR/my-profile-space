import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRoutes from "./AppRoutes";
import "@mantine/dates/styles.css";
import userStore from "./store/userStore";
import { useEffect } from "react";

function App() {
  const {
    isInitializing,
    loadFaqs,
    loadUserDetails,
    loadUserSettings,
    loadServices,
    loadSkills,
    loadExperiences,
    loadEducations,
    loadProjects,
    loadTestimonials,
    loadUserSocials,
    loadPlatformSocials,
  } = userStore();

  useEffect(() => {
    if (!isInitializing) {
      loadSkills();
      loadExperiences();
      loadEducations();
      loadFaqs();
      loadServices();
      loadTestimonials();
      loadProjects();
      loadUserSocials();
      loadPlatformSocials();
      loadUserSettings();
      loadUserDetails();
    }
  }, [isInitializing]);
  return (
    <>
      <AppRoutes></AppRoutes>
      {/* <ToastContainer /> */}
    </>
  );
}

export default App;
