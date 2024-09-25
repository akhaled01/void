import { render as vDOMRender } from "./DOM/render"; // Import vDOM render function
import { VNode } from "./DOM/types"; // Import the type for your virtual DOM node

export class Router {
  routes: any;
  root: HTMLElement | null;
  pageContext: __WebpackModuleApi.RequireContext;
  currentVNode: VNode | null; // Store the current virtual DOM node
  stylesheetRef: HTMLLinkElement | null; // Reference to the stylesheet link element

  constructor(routes: any) {
    this.routes = routes;
    this.pageContext = require.context("../src/app", true, /page\.tsx$/); // Targeting .tsx files
    this.root = document.getElementById("root"); // Or any other container
    this.stylesheetRef = document.getElementById(
      "stylesheet-ref"
    ) as HTMLLinkElement; // Reference to <link> element for styles
    this.handleRouteChange = this.handleRouteChange.bind(this); // Ensure proper `this` context
    this.currentVNode = null; // Initialize the virtual DOM node as null
    this.init();
  }

  private isInternalLink(href: string): boolean {
    // A simple way to check if the link is internal is to see if it's relative or starts with the same origin
    const isSameOrigin = href.startsWith(window.location.origin);
    const isRelativeLink = href.startsWith("/") || href.startsWith(".");

    return isSameOrigin || isRelativeLink;
  }

  private init() {
    this.handleRouteChange();
    window.addEventListener("popstate", this.handleRouteChange);
    document.body.addEventListener("click", (event) => {
      const target = event.target as HTMLElement; // Type assertion
      if (target.tagName === "A") {
        event.preventDefault();
        const href = (target as HTMLAnchorElement).getAttribute("href");
        if (href && this.isInternalLink(href)) {
          console.log("internal ref");
          event.preventDefault();
          window.history.pushState(null, "", href);
          this.handleRouteChange();
        } else {
          window.location.href = href;
        }
      }
    });
  }

  private async handleRouteChange() {
    const path =
      window.location.pathname === "/" ? "" : window.location.pathname;
    const componentPath = `.${path}/page.tsx`;

    try {
      const Page = await this.pageContext(componentPath).default;
      this.updateCSS(path); // Update the CSS based on the route
      await this.updateRoute(Page); // Use vDOM update method
    } catch (error) {
      console.error(`Error loading component for path: ${path}`, error);
    }
  }

  private updateCSS(path: string) {
    if (this.stylesheetRef) {
      const cssFileName =
        path === "" ? "css/index.css" : `css/${path.substring(1)}.css`; // Get the correct CSS file
      this.stylesheetRef.setAttribute("href", cssFileName); // Set the new href
    }
  }

  private async updateRoute(Page: () => Promise<VNode>) {
    const newVNode = await Page(); // Get the virtual DOM for the new page

    if (this.root) {
      // Clear the current content and render the new virtual DOM
      this.root.innerHTML = ""; // Clear the existing content
      const realDOM = await vDOMRender(newVNode); // Render the vDOM to real DOM
      this.root.appendChild(realDOM); // Append the new content
    }

    this.currentVNode = newVNode; // Update the current vDOM
  }
}
