export class Router {
  routes: any;
  root: HTMLElement | null;
  constructor(routes) {
    this.routes = routes;
    this.root = document.getElementById("root"); // Or any other container
    this.handleRouteChange = this.handleRouteChange.bind(this); // Ensure proper `this` context
    this.init();
  }

  init() {
    this.handleRouteChange();
    window.addEventListener("popstate", this.handleRouteChange);
    document.body.addEventListener("click", (event) => {
      const target = event.target as HTMLElement; // Type assertion
      if (target.tagName === "A") {
        event.preventDefault();
        const href = (target as HTMLAnchorElement).getAttribute("href");
        window.history.pushState(null, "", href);
        this.handleRouteChange();
      }
    });
  }

  handleRouteChange() {
    const path = window.location.pathname;
    const Component = this.routes[path] || this.routes["*"]; // Fallback to NotFound component
    if (typeof Component === "function") {
      this.render(Component);
    } else {
      console.error(`No component found for path: ${path}`);
    }
  }

  render(Component) {
    if (this.root) {
      this.root.innerHTML = ""; // Clear previous content
      const element = Component(); // Call the component function
      if (element instanceof Node) {
        this.root.appendChild(element);
      } else {
        console.error("Component did not return a valid DOM element.");
      }
    } else {
      console.error("Root element not found.");
    }
  }
}
