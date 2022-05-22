import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";
import { AnalyticsProvider } from "use-analytics";
import Analytics from "analytics";
import googleAnalytics from "@analytics/google-analytics";

const myPlugin = {
    name: "my custom plugin",
    page: ({ payload }) => {
      console.log("page", payload);
    },
    track: ({ payload }) => {
      console.log(payload, "--payload");
    },
  },
  analytics = Analytics({
    app: "awesome",
    plugins: [
      // myPlugin,
      googleAnalytics({
        trackingId: "UA-167340127-1",
      }),
    ],
  });

ReactDOM.render(
  <Provider store={store}>
    <AnalyticsProvider instance={analytics}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AnalyticsProvider>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
