# Osiris.JS

> “Be industrious, let thine eyes be open, lest you become a beggar, for the man that is idle cometh not to honor.” - Muata Ashby

## Overview

**Osiris** is a lightweight JavaScript framework designed for building dynamic web applications efficiently. It features a custom virtual DOM for optimal UI updates, a routing system akin to Next.js’s app router, and an intuitive event handling mechanism. Osiris allows you to use JSX for creating components seamlessly.

> Osiris is very much unopinionated, if you don't like the way things are done, feel free to change em!

## How Osiris Works

Osiris maintains a virtual representation of the DOM, allowing for efficient updates. Changes are computed and applied only where necessary, enhancing performance by reducing direct DOM manipulations.

## Getting Started

### Installation

1. Clone the repository or download the source code.
2. Install dependencies using npm or yarn.
3. Include the core files in your project structure.

### Using JSX

Osiris supports JSX for creating elements. To use JSX, ensure your `tsconfig.json` is set up to handle JSX syntax with the `perserve` option.

#### Example: Creating a Component with JSX

```typescript
import { createElement } from "@core/DOM/createElement";

const MyComponent = () => {
  return (
    <div id="myDiv" class="container">
      Hello, Osiris!
    </div>
  );
};
```

### Using CSS

Osiris handles css using css modules, you may declare them inside the `css` folder for typescript alias support, but really you can have em anywhere.

> tailwind integration coming soon! look below for an example usage of css in osiris

### Adding Events

You can use the `Signal` class to handle events. This class allows you to listen for and trigger events on DOM elements.

#### Example: Adding a Click Event to a Button

```typescript
import { createElement } from "@core/DOM/createElement";
import { Signal } from "@core/signal";

const MyButton = () => {
  const button = <button id="myButton">Click Me</button>;
  Signal.listen(button, "click", () => {
    alert("Button was clicked!");
  });
  return button;
};
```

> You can also bind events to an element with `on` attributes that HTML5 supports, like so:

```typescript
const button = <button onClick={upArr}>Update Array</button>
```

### Routing

The `Router` class manages navigation between different views in your application, similar to Next.js’s app router. You can define routes and dynamically load components based on the current file structure. The `Page` function inside needs to be defaultly exported

```bash
├── about
│   └── page.tsx -> `/about`
├── page.tsx -> `/`
└── sample
    └── page.tsx -> `/sample`
```

## State Management with Pulses

### Overview

The `Pulse` class provides a reactive data structure that allows for efficient updates and rendering of DOM elements based on changes to its state. It is particularly useful for managing arrays and objects while maintaining reactivity.

### Type Parameters

- **T**: Type of the value being managed, which can be an object or an array.

### Class Properties

- `private proxyValue: T`: The reactive value managed by the Pulse instance.
- `private id: string`: Unique identifier for the Pulse instance.
- `private listeners: Set<(value: T) => void>`: Set of subscriber callbacks that are notified on value changes.
- `private template?: (data: T, index?: number, pulseID?: string) => Promise<VNode>`: Template function for rendering the data.
- `private rootElement: HTMLElement | null`: The DOM element to which the Pulse instance is attached.
- `childPulseMap: Map<string, Pulse<any>>`: Registry for child Pulses associated with array items.

### Constructor

```typescript
constructor(initialValue: T, id: string, template?: (data: T, index?: number, pulseID?: string) => Promise<VNode>)
```

- **initialValue**: The initial value to be managed by the Pulse instance.
- **id**: Unique identifier for the Pulse instance.
- **template**: Optional template function for rendering.

### Methods

#### `set(newValue: T): void`

Sets a new value for the Pulse instance and triggers re-rendering.

#### `get(): T`

Returns the current value managed by the Pulse instance.

#### `subscribe(listener: (value: T) => void): () => void`

Adds a listener to be notified on value changes. Returns a function to unsubscribe.

#### `attachTo(element: HTMLElement): void`

Attaches the Pulse instance to a specified DOM element for rendering.

#### `addItem(item: any): void`

Adds a new item to the array if the managed value is an array. Triggers rendering.

#### `updateItem(index: number, newValue: any): void`

Updates an item in the array at the specified index. Triggers rendering.

#### `removeItem(index: number): void`

Removes an item from the array at the specified index. Triggers rendering.

#### `notifyListeners(): void`

Notifies all subscribers about the value change.

### Global Registry

#### `pulseRegistry: Map<string, Pulse<any>>`

A global registry to keep track of all Pulse instances by their unique IDs.

#### `genPulse`

```typescript
const genPulse = <T extends object | Array<any>>(
  initialValue: T,
  id: string,
  baseTemplate?: (data: any, index?: number, pulseID?: string) => Promise<VNode>,
  childTemplate?: (data: any, index?: number, pulseID?: string) => Promise<VNode>
): Pulse<T>
```

Generates a new Pulse instance and adds it to the global registry.

- **initialValue**: The initial value for the new Pulse.
- **id**: Unique ID for the new Pulse.
- **baseTemplate**: Optional base template for rendering the parent object.
- **childTemplate**: Optional template for rendering child items.

## Example Usage

Below is an example demonstrating how to use the `Pulse` class in a React-like environment:

```typescript
/** @jsx createElement */
import { createElement } from "Core/DOM/createElement";
import { genPulse } from "Core/pulse";
import { Signal } from "Core/signal";
import "CSS/home.css";

// Child template function for rendering each item in the array
const itemTemplate = async (item: { checked: any; toggleCheck: () => any; a: any; b: any; }, index: number) => {
  return (
    <div class={`aab${item.checked ? " checked" : ""}`}>
      <button id={`arr-button-${index}`} onClick={() => item.toggleCheck()}>Check</button>
      <p>{item.a}</p>
      <p>{item.b}</p>
      <p>{item.checked ? "Checked" : "Unchecked"}</p>
    </div>
  );
};

// Base template function that renders the entire array and the update button
const baseTemplate = async (array: { a: number; b: number; checked: boolean; toggleCheck: () => void; }[], upArr: () => void) => {
  return (
    <div>
      <div id="array-signal"></div>
      <button onClick={upArr}>Update Array</button>
    </div>
  );
};

const Page = async () => {
  const sig = genPulse(
    [
      {
        a: 1,
        b: 2,
        checked: true,
        toggleCheck: function () {
          this.checked = !this.checked; // Toggle checked state
        }
      },
    ],
    "arr",
    async (item, index) => itemTemplate(item, index) // Use the child template
  );

  // Move upArr function above its usage in baseTemplate
  const upArr = () => {
    const currentArray = sig.get();
    if (Array.isArray(currentArray)) {
      sig.addItem({
        a: 2,
        b: 3,
        checked: false,
        toggleCheck: function () {
          this.checked = !this.checked; // Toggle checked state
        }
      }); // Use addItem to append to array
    } else {
      console.error("sig does not contain an array:", currentArray);
    }
  };

  Signal.listen(document, "DOMContentLoaded", () => {
    const rootElement = document.getElementById("array-signal");
    if (rootElement) {
      sig.attachTo(rootElement);
    } else {
      console.error("Root element for sig not found");
    }
  });

  return await baseTemplate(sig.get(), upArr); // Pass upArr to the base template
};

export default Page;
```

In this example, the `Page` component initializes a `Pulse` instance with an array of objects. Each object can be toggled between checked and unchecked states. The `upArr` function allows adding new items to the array, demonstrating the dynamic nature of the `Pulse` class.

## Conclusion

Osiris enables you to create dynamic web applications with ease using JSX for component creation, an intuitive event handling system, and a powerful router similar to Next.js. This documentation provides you with the foundational knowledge to get started, allowing you to build your applications without guesswork.

For additional resources, explore the framework’s repository or community forums.
