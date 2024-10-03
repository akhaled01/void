# Vortex

> “Be industrious, let thine eyes be open, lest you become a beggar, for the man that is idle cometh not to honor.” – Muata Ashby

Vortex is a lightweight, unopinionated front-end framework inspired by React and Next.js. It provides a Data Binding-based state management solution through a reactive system called **Pulses**, and a simple client-side router, making it ideal for modern web development.

## Key Features

- **Virtual DOM Rendering:** Efficiently converts virtual nodes (VNode) to actual DOM elements, minimizing re-renders and improving performance.
- **State Management:** Pulse-based reactivity system to handle state updates with minimal boilerplate.
- **Routing:** Simple client-side routing with dynamic page imports, similar to Next.js.
- **Event Management:** Utility functions for handling DOM events in a clean and structured way.

---

## Installation

Start a new Vortex project using `npx`:

```bash
npx @akhaled01/vortex my-app
cd my-app
npm install
npm run dev
```

---

## DOM Rendering

Vortex handles components in a way that's similar to React. Below is an example that demonstrates how to manage a to-do item:

```typescript
export const todoItemTemplate = (todo: Todo): VNode => {
  const activeTodos = pulseRegistry.get("active-todo-list");
  const completedTodos = pulseRegistry.get("completed-todo-list");
  const mainTodos = pulseRegistry.get("main-todo-list");

  return (
    <div className={`todo-item${todo.completed ? " completed" : ""}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => todo.toggleComplete()}
        className="todo-checkbox"
      />
      <span
        className="todo-title"
        onClick={() => {
          const newTitle = prompt("Enter new todo title");
          if (newTitle) {
            const todoList = activeTodos.get().concat(completedTodos.get());
            const todoIndex = todoList.findIndex((t: Todo) => t.id === todo.id);
            todoList[todoIndex].title = newTitle;

            if (todo.completed) {
              completedTodos.set(todoList.filter((t) => t.completed));
            } else {
              activeTodos.set(todoList.filter((t) => !t.completed));
            }
          }
        }}
      >
        {todo.title}
      </span>
      <button
        className="delete-btn"
        onClick={() => {
          if (todo.completed) {
            const todoIndex = completedTodos.get().findIndex((t: Todo) => t.id === todo.id);
            completedTodos.removeItem(todoIndex);
            mainTodos.set(completedTodos.get());
          } else {
            const todoIndex = activeTodos.get().findIndex((t: Todo) => t.id === todo.id);
            activeTodos.removeItem(todoIndex);
            mainTodos.set(activeTodos.get());
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};
```

The structure closely mimics React’s component system thanks to Vortex's `createElement` and `render` functions. You can extend or modify them to handle custom bindings in your app. These functions are located in `core/DOM/render`.

---

## Routing

Vortex comes with a simple router system. To define routes, create folders and add `page.tsx` files inside them.

Example folder structure:

```
app
├── page.tsx -> maps to `/`
└── todo
    └── page.tsx -> maps to `/todo`
```

Inside each `page.tsx`, define a `Page` functional component (similar to React) and export it as the default.

**Note:** 
- Dynamic URL handling is coming in v1.1.
- If there is a corresponding CSS file like `todo.css`, it will automatically be applied to `/todo`.
- Tailwind CSS support will be added soon.

---

## Pulses

The Pulse class powers state management in Vortex through a reactive system that tracks changes using proxies.

### Constructor

```typescript
constructor(
  initialValue: T,
  id: string,
  template?: (data: T, index?: number, pulseID?: string) => VNode
)
```

- `initialValue`: Initial state of the data (object or array).
- `id`: A unique identifier for the Pulse instance (UUID preferred).
- `template`: A function that defines how data should be rendered as a VNode. It also re-renders the UI when data changes.

### Methods

- **`set(newValue: T): void`**  
  Updates the Pulse instance with a new value, triggering a re-render.
  
- **`get(): T`**  
  Returns the current state of the reactive data.
  
- **`subscribe(listener: (value: T) => void): () => void`**  
  Adds a listener to observe data changes. Returns an unsubscribe function.
  
- **`attachTo(element: HTMLElement): void`**  
  Binds the Pulse instance to a DOM element and performs an initial render.
  
- **`performDOMRender(): void`**  
  Triggers a manual re-render using the current value and template function.

Array-Specific Methods:

- **`addItem(item: any): void`**  
  Adds a new item to the Pulse array and updates the DOM.

- **`removeItem(index: number): void`**  
  Removes an item from the array by index and updates the DOM.

- **`updateItem(index: number, newValue: any): void`**  
  Updates an item at the specified index and refreshes the DOM.

### Generating a Pulse

To create a new Pulse instance:

```typescript
genPulse<T extends object | Array<any>>(
  initialValue: T,
  id: string,
  template?: (data: T, index?: number, pulseID?: string) => VNode
): Pulse<T>
```

Example:

```typescript
const myPulse = genPulse<{ name: string }>({ name: "John Doe" }, "user-pulse");
myPulse.attachTo(document.getElementById("user-info"));
```

---

## Event Management with Signals

Vortex provides utility functions for managing events on `Document` and `HTMLElement` objects.

```typescript
import { Signal } from "Core/signal";

// Listening to events
Signal.listen(document, "click", (event) => {
  console.log("Document was clicked!");
});

// Triggering events
Signal.trigger(document, "customEvent");
```

### Event Listener Extensions

Vortex extends `HTMLElement` and `Document` prototypes with the following utility methods:

- **`listen(eventType, callback)`**  
  Adds an event listener to an element.

- **`listenMultiple(eventTypes, callback)`**  
  Adds multiple event listeners to an element.

- **`trigger(eventType)`**  
  Triggers a custom event.

Example:

```typescript
document.listen("click", () => console.log("Document clicked!"));
```

---

## Roadmap

- **Dynamic URL Handling:** Coming in v1.1.
- **Tailwind CSS Support:** Coming soon.

Stay tuned for more updates as Vortex continues to evolve!
