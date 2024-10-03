import { render as vDOMRender } from "./DOM/render"; // Import vDOM render function
import { VNode } from "./DOM/types"; // Import the type for your virtual DOM node
import { pulseRegistry } from "./pulse";
import { DocumentEventNames, Signal } from "./signal";

/**
 * Router class to handle client-side routing and rendering
 * of pages using a virtual DOM approach.
 */
export class Router {
  /** The root element where pages will be rendered */
  root: HTMLElement | null;
  /** Context for dynamic imports of page components */
  pageContext: __WebpackModuleApi.RequireContext;
  /** Store the current virtual DOM node */
  currentVNode: VNode | null;
  /** Reference to the <link> element for stylesheets */
  stylesheetRef: HTMLLinkElement | null;

  /**
   * Initializes the Router instance, sets up event listeners,
   * and extends HTMLElement and Document prototypes with custom event methods.
   */
  constructor() {
    this.pageContext = require.context("../src/app", true, /page\.tsx$/); // Targeting .tsx files for routing
    this.root = document.getElementById("root"); // Get the root container for rendering
    this.stylesheetRef = document.getElementById(
      "stylesheet-ref"
    ) as HTMLLinkElement; // Reference to <link> element for styles
    this.handleRouteChange = this.handleRouteChange.bind(this); // Bind the route change handler

    this.currentVNode = null; // Initialize the current virtual DOM node as null

    // Extend HTMLElement and Document prototypes with event handling methods
    this.extendDOMMethods();

    this.init(); // Initialize the router
  }

  /**
   * Extend HTMLElement and Document prototypes to include custom event handling methods.
   */
  private extendDOMMethods() {
    HTMLElement.prototype.listen = function <T extends DocumentEventNames>(
      this: HTMLElement,
      eventName: T,
      callback: (event: DocumentEventMap[T]) => void
    ) {
      return Signal.listen(this, eventName, callback);
    };

    HTMLElement.prototype.listenMultiple = function <
      T extends DocumentEventNames
    >(
      this: HTMLElement,
      eventNames: T[],
      callback: (event: DocumentEventMap[T]) => void
    ) {
      return Signal.listenMultiple(this, eventNames, callback);
    };

    HTMLElement.prototype.trigger = function (
      this: HTMLElement,
      eventName: DocumentEventNames
    ) {
      Signal.trigger(this, eventName);
    };

    Document.prototype.listen = function <T extends DocumentEventNames>(
      this: Document,
      eventName: T,
      callback: (event: DocumentEventMap[T]) => void
    ) {
      return Signal.listen(this, eventName, callback);
    };

    Document.prototype.listenMultiple = function <T extends DocumentEventNames>(
      this: Document,
      eventNames: T[],
      callback: (event: DocumentEventMap[T]) => void
    ) {
      return Signal.listenMultiple(this, eventNames, callback);
    };

    Document.prototype.trigger = function (
      this: Document,
      eventName: DocumentEventNames
    ) {
      Signal.trigger(this, eventName);
    };
  }

  /**
   * Checks if the given link is an internal link.
   *
   * @param {string} href - The href attribute of the anchor element.
   * @returns {boolean} True if the link is internal, false otherwise.
   */
  private isInternalLink(href: string): boolean {
    const isSameOrigin = href.startsWith(window.location.origin);
    const isRelativeLink = href.startsWith("/") || href.startsWith(".");
    return isSameOrigin || isRelativeLink; // Return true for internal links
  }

  /**
   * Initializes the router by setting up event listeners
   * and handling the initial route change.
   */
  private init() {
    this.handleRouteChange(); // Load the initial route
    window.addEventListener("popstate", this.handleRouteChange); // Listen for browser back/forward navigation
    document.body.addEventListener("click", (event) => {
      const target = event.target as HTMLElement; // Type assertion for target
      if (target.tagName === "A") {
        event.preventDefault(); // Prevent default anchor behavior
        const href = (target as HTMLAnchorElement).getAttribute("href");
        if (href && this.isInternalLink(href)) {
          console.log("Internal link clicked");
          window.history.pushState(null, "", href); // Update history state
          this.handleRouteChange(); // Handle route change
        } else {
          window.location.href = href; // Navigate to external link
        }
      }
    });
  }

  /**
   * Handles route changes by loading the appropriate page component
   * and updating the displayed content.
   */
  private handleRouteChange() {
    const path =
      window.location.pathname === "/" ? "" : window.location.pathname; // Normalize path
    const componentPath = `.${path}/page.tsx`; // Construct component path

    try {
      pulseRegistry.clear() // clear all pulses
      const Page = this.pageContext(componentPath).default; // Dynamically import the page component
      this.updateCSS(path); // Update the CSS based on the route
      this.updateRoute(Page); // Render the new route
    } catch (error) {
      console.error(`Error loading component for path: ${path}`, error);
    }
  }

  /**
   * Updates the stylesheet reference based on the current route.
   *
   * @param {string} path - The current route path.
   */
  private updateCSS(path: string) {
    if (this.stylesheetRef) {
      const cssFileName =
        path === "" ? "css/index.css" : `css/${path.substring(1)}.css`; // Determine the correct CSS file
      this.stylesheetRef.setAttribute("href", cssFileName); // Update the stylesheet href
    }
  }

  /**
   * Updates the displayed content by rendering the new virtual DOM node.
   *
   * @param {() => Promise<VNode>} Page - The page component to render.
   */
  private updateRoute(Page: () => VNode) {
    const newVNode = Page(); // Get the virtual DOM for the new page

    if (this.root) {
      this.root.innerHTML = ""; // Clear existing content
      const realDOM = vDOMRender(newVNode); // Render the virtual DOM to real DOM
      this.root.appendChild(realDOM); // Append the new content to the root
    }

    this.currentVNode = newVNode; // Update the current virtual DOM node
  }
}
