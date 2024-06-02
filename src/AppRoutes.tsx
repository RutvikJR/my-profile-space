import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Layout from "./pages/Layout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import ForgotPassword from "./pages/ForgotPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route index element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="*" element={<NoPage />} />
        
      </Route>
    </Routes>
  );
};

export default AppRoutes;
