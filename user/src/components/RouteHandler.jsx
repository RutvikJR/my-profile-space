import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FullTemplet from "../FullTemplet.jsx";
import NoPage from "./NoPage.jsx";
import UserDataNotFound from "./UserDataNotFound.jsx";
import useStore from "../store.js";

const RouteHandler = () => {
  const { userSettings, loadAllData, theme } = useStore();
  const { slug } = useParams();
  const [validSlug, setValidSlug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      loadAllData(slug)
        .then(async () => {
          if (theme) {
            await importThemeStyles(theme);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [slug, loadAllData, theme]);

  useEffect(() => {
    if (!loading && userSettings) {
      const isSlugPresent = userSettings.some(
        (setting) => setting.slug === slug
      );
      setValidSlug(isSlugPresent);
    } else if (!slug) {
      setValidSlug(false);
    }
  }, [slug, userSettings, loading]);

  const importThemeStyles = async (theme) => {
    try {
      switch (theme) {
        case "cyan":
          await import("../sass/color-cyan.scss");
          break;
        case "green-yellow":
          await import("../sass/color-green-yellow.scss");
          break;
        case "lime-punch":
          await import("../sass/color-lime-punch.scss");
          break;
        case "orange":
          await import("../sass/color-orange.scss");
          break;
        case "pale-golden-rod":
          await import("../sass/color-pale-golden-rod.scss");
          break;
        case "spring-green":
          await import("../sass/color-spring-green.scss");
          break;
        case "violet":
          await import("../sass/color-violet.scss");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (validSlug) {
    return <FullTemplet />;
  } else if (slug && !validSlug) {
    return <UserDataNotFound />;
  } else {
    return <NoPage />;
  }
};

export default RouteHandler;
