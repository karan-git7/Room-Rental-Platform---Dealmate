import React, { createContext, useContext, useEffect, useState } from "react";
import api, { getPublicImageUrl } from "../utils/api";

const LogoContext = createContext();

const DEFAULT_LOGO = "/images/logos/logo.svg";

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState(DEFAULT_LOGO);

  const fetchLogo = async () => {
    try {
      const { data } = await api.get("/admin/settings/logo");
      if (data?.logo) {
         setLogo(getPublicImageUrl(data.logo, 'product'));
      } else {
          setLogo(DEFAULT_LOGO);
      }
    } catch (err) {
      // console.error("Failed to fetch logo", err);
      // Silent fail to default
      setLogo(DEFAULT_LOGO);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  return (
    <LogoContext.Provider value={{ logo, fetchLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  return useContext(LogoContext);
}
