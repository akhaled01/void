export class Router {
  routes: any;
  root: HTMLElement | null;
  pageContext: __WebpackModuleApi.RequireContext;

  constructor(routes) {
    this.routes = routes;
    this.pageContext = require.context("../src/app", true, /page\.tsx$/); // Targeting .tsx files
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

  async handleRouteChange() {
    const path =
      window.location.pathname === "/" ? "" : window.location.pathname;
    const componentPath = `.${path}/page.tsx`;

    try {
      const Page = this.pageContext(componentPath).default;
      this.render(Page);
    } catch (error) {
      console.error(`Error loading component for path: ${path}`, error);
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
