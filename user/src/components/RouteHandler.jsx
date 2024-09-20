import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FullTemplet from "../FullTemplet.jsx";
import NoPage from "./NoPage.jsx";
import UserDataNotFound from "./UserDataNotFound.jsx";
import useStore from "../store.js";

const RouteHandler = () => {
  const { userSettings } = useStore();
  const { slug } = useParams();
  const [validSlug, setValidSlug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // Simulate loading delay if needed
      setLoading(false); 
    } else {
      setLoading(false); 
    }
  }, [slug]);

  useEffect(() => {
    if (!loading && userSettings) {
      const isSlugPresent = userSettings.some(setting => setting.slug === slug);
      setValidSlug(isSlugPresent);
    } else if (!slug) {
      setValidSlug(false);
    }
  }, [slug, userSettings, loading]);

  if (loading) {
    return <FullTemplet />; 
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
