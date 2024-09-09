import { Router } from "Core/Router.js";
import Home from "./app/Home.jsx";
import About from "./app/About.jsx";

// Define your routes
const routes = {
  "/": Home,
  "/about": About,
};

// Initialize the router
const router = new Router(routes);

// Set up basic navigation (for example, using links)
document.body.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    window.history.pushState(null, "", href);
    router.handleRouteChange();
  }
});
