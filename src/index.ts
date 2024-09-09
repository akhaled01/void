// Importing the Router class from the core module and component files
import { Router } from "../core/Router"; // Adjust the path if necessary
import Home from "./app/Home"; // Import the Home component
import About from "./app/About"; // Import the About component

// Initialize the router
// Create an instance of the Router class, passing the routes configuration.
new Router({
  "/": Home, // Maps the root path to the Home component
  "/about": About, // Maps the '/about' path to the About component
});
