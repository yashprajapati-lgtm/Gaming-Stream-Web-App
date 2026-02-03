import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.css";   // 👈 THIS LINE WAS MISSING

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
