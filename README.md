# Osiris Framework Documentation

## Overview

**Osiris** is a lightweight JavaScript framework that enables developers to build dynamic web applications efficiently. It features a custom virtual DOM for efficient UI updates, a simple routing system, and an intuitive event handling mechanism.

## How Osiris Works

At its core, Osiris operates by maintaining a virtual representation of the DOM. When changes are made, Osiris calculates the minimal updates needed and applies them to the real DOM. This approach enhances performance by reducing unnecessary DOM manipulations.

## Getting Started

### Installation

1. Clone the repository or download the source code.
2. Install dependencies using npm or yarn.
3. Include the core files in your project structure.

### Creating Elements

Osiris uses a custom `createElement` function to create DOM elements. This function takes three parameters: the tag name, attributes, and children.

#### Example: Creating a Div

```typescript
import { createElement } from "@core/DOM/createElement";

const myDiv = createElement("div", { id: "myDiv", class: "container" }, "Hello, Osiris!");
document.body.appendChild(myDiv);
```

### Adding Events

To handle events, you can use the `Signal` class provided by Osiris. This class allows you to listen for and trigger events on DOM elements.

#### Example: Adding a Click Event to a Button

```typescript
import { createElement } from "@core/DOM/createElement";
import { Signal } from "@core/signal";

const myButton = createElement("button", { id: "myButton" }, "Click Me");
document.body.appendChild(myButton);

// Listen for click events
Signal.listen(myButton, "click", () => {
  alert("Button was clicked!");
});
```

### Using the Router

The `Router` class manages navigation between different views in your application. You can define routes and load corresponding components dynamically.

#### Example: Setting Up the Router

```typescript
import { Router } from "@core/router";

const routes = {
  "/": () => createElement("div", {}, "Home Page"),
  "/about": () => createElement("div", {}, "About Page"),
};

const router = new Router(routes);
```

### Complete Example

Here's a simple application that creates a navigation menu and responds to button clicks.

```typescript
import { createElement } from "@core/DOM/createElement";
import { Signal } from "@core/signal";
import { Router } from "@core/router";

const routes = {
  "/": () => createElement("div", {}, "Home Page"),
  "/about": () => createElement("div", {}, "About Page"),
};

const router = new Router(routes);

// Create navigation links
const nav = createElement("nav", {}, 
  createElement("a", { href: "/" }, "Home"),
  createElement("a", { href: "/about" }, "About")
);
document.body.appendChild(nav);

// Create a button
const myButton = createElement("button", { id: "myButton" }, "Click Me");
document.body.appendChild(myButton);

// Listen for clicks on the button
Signal.listen(myButton, "click", () => {
  alert("Button was clicked!");
});

// Initial route render
router.handleRouteChange();
```

## Conclusion

With Osiris, you can easily create elements, handle events, and manage routing in your web applications. This documentation provides the foundational knowledge needed to get started, and you can explore the source code for more advanced functionalities.

For additional resources, consider exploring the framework’s repository or community forums.

---

This documentation should help new users understand how to effectively use Osiris without much guesswork. Let me know if you need further modifications or additional topics covered!