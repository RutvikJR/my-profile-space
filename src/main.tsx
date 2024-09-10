window.global ||= window;
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Notifications /> */}
      <MantineProvider>
        <Notifications />
        {/* <Notifications position="top-right" zIndex={9999} /> */}
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
