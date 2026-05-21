import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Stars from "./stars";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <Stars maxrating={5} color="gold" size={48} defRating={2} /> */}
  </React.StrictMode>,
);
