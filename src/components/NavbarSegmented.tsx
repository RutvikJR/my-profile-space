import { useState } from "react";
import { SegmentedControl, Text } from "@mantine/core";
import { IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import classes from "./NavbarSegmented.module.css";
import { supabaseClient } from "../config/supabaseConfig";
import { showToast } from "../utils/toast";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { link: "/education", label: "Education" },
  { link: "/userdetails", label: "User" },
  { link: "/experience", label: "Experience" },
  { link: "/skills", label: "Skills" },
  { link: "/projects", label: "Projects" },
  { link: "/testimonials", label: "Testimonials" },
  { link: "/faqs", label: "FAQs" },
  { link: "/services", label: "Services" },
  { link: "/social-media", label: "Social Media" },
];

export function NavbarSegmented() {
  const navigate = useNavigate();

  const [active, setActive] = useState("Billing");

  const logoutUser = async () => {
    const res = await supabaseClient.auth.signOut();
    if (res.error) {
      showToast("Logging out failed", "error");
      console.log(res.error);
    } else {
      showToast("Logged out successfully", "success");
      navigate("/login");
    }
  };

  const links = navLinks.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav
      className={
        classes.navbar +
        " col-span-3 h-full overfolow-y-scroll w-full bg-gray-50"
      }
    >
      <div>
        <Link to={"/"} className={classes.title + " text-xl"}>
          My Profile Space
        </Link>
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <button className={classes.link} onClick={logoutUser}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
