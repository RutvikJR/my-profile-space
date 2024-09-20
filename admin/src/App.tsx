import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRoutes from "./AppRoutes";
import "@mantine/dates/styles.css";
import userStore from "./store/userStore";
import { useEffect } from "react";

function App() {
  const {
    initializeUser,
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
    if (isInitializing) {
      initializeUser();
    }
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

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppRoutes></AppRoutes>
      {/* <ToastContainer /> */}
    </>
  );
}

export default App;
