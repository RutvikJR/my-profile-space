import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";
import Services from "./pages/Services";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import FAQs from "./pages/FAQs";
import Testimonials from "./pages/Testimonials";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="contact"
          element={
            <AuthGuard>
              <Contact />
            </AuthGuard>
          }
        />
        <Route
          path="services"
          element={
            <AuthGuard>
              <Services />
            </AuthGuard>
          }
        />
        <Route
          path="experience"
          element={
            <AuthGuard>
              <Experience />
            </AuthGuard>
          }
        />
        <Route
          path="education"
          element={
            <AuthGuard>
              <Education />
            </AuthGuard>
          }
        />
        <Route
          path="skills"
          element={
            <AuthGuard>
              <Skills />
            </AuthGuard>
          }
        />
        <Route
          path="projects"
          element={
            <AuthGuard>
              <Projects />
            </AuthGuard>
          }
        />
        <Route
          path="faqs"
          element={
            <AuthGuard>
              <FAQs />
            </AuthGuard>
          }
        />
        <Route
          path="testimonials"
          element={
            <AuthGuard>
              <Testimonials />
            </AuthGuard>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
