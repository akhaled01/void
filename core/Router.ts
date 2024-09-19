import { diff } from "./vDOM/diff"; // Import your diffing algorithm
import { patch } from "./vDOM/patch"; // Import your patching function
import { render as vDOMRender } from "./vDOM/render"; // Import vDOM render function
import { VNode } from "./vDOM/types"; // Import the type for your virtual DOM node

export class Router {
  routes: any;
  root: HTMLElement | null;
  pageContext: __WebpackModuleApi.RequireContext;
  currentVNode: VNode | null; // Store the current virtual DOM node

  constructor(routes: any) {
    this.routes = routes;
    this.pageContext = require.context("../src/app", true, /page\.tsx$/); // Targeting .tsx files
    this.root = document.getElementById("root"); // Or any other container
    this.handleRouteChange = this.handleRouteChange.bind(this); // Ensure proper `this` context
    this.currentVNode = null; // Initialize the virtual DOM node as null
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
      const Page = await this.pageContext(componentPath).default;
      await this.updateRoute(Page); // Use vDOM update method
    } catch (error) {      
      console.error(`Error loading component for path: ${path}`, error);
    }
  }

  async updateRoute(Page: () => VNode) {
    const newVNode = await Page(); // Get the virtual DOM for the new page    

    if (this.currentVNode === null) {
      // Initial render if no current vDOM
      if (this.root) {
        const realDOM = await vDOMRender(newVNode); // Render the vDOM to real DOM
        this.root.appendChild(realDOM);
      }
    } else {
      // If there is already a current vDOM, perform diff and patch
      const patches = diff(this.currentVNode, newVNode); // Calculate the differences      
      if (this.root) {
        patch(this.root, patches); // Apply the patches to update the real DOM
      }
    }

    this.currentVNode = newVNode; // Update the current vDOM
  }
}
