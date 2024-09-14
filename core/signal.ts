import { createElement } from "./vDOM/createElement";
import { diff } from "./vDOM/diff";
import { patch } from "./vDOM/patch";
import { render } from "./vDOM/render";
import { VNode } from "./vDOM/types";

export class Signal<T extends object | any[]> {
  private proxyValue: T;
  private listeners: Set<(value: T) => void>;
  private bindings: Map<keyof T | number, HTMLElement[]> = new Map(); // Support number indices for arrays

  constructor(initialValue: T) {
    this.listeners = new Set();
    this.proxyValue = this.makeReactive(initialValue); // Make object/array reactive
  }

  // Make the object or array reactive using Proxy
  private makeReactive(value: T): T {
    const self = this;

    return new Proxy(value, {
      get(target, prop) {
        const result = Reflect.get(target, prop);

        // Ensure result is an object, not null, and not an array (for nested objects)
        if (result && typeof result === "object" && !Array.isArray(result)) {
          return self.makeReactive(result as T); // Ensure type safety
        }

        return result;
      },
      set(target, prop, newValue) {
        const oldValue = target[prop as keyof T];
        if (oldValue !== newValue) {
          Reflect.set(target, prop, newValue);
          self.notifyListeners(); // Notify listeners on any property change
          self.update(prop as keyof T | number); // Re-render the bound elements for this property or array index
        }
        return true;
      }
    });
  }

  addItem(item: any): void {
    if (Array.isArray(this.proxyValue)) {
      // Create a new array with the item added
      const f = this.proxyValue[0] === null
      const newArray = f ? [item] : [...(this.get() as any[]), item];
      console.log(newArray);
      this.proxyValue = this.makeReactive(newArray as T); // Reassign with new array
      this.notifyListeners(); // Notify listeners about the change
      this.reRenderArr(f); // Directly invoke re-render when new items are added
    } else {
      throw new Error("addItem can only be used with arrays");
    }
  }

  // Get the current reactive value
  get(): T {
    return this.proxyValue;
  }

  // Subscribe to changes
  subscribe(listener: (value: T) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners when a value changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.proxyValue));
  }

  // Bind the signal to an element and a specific property or array index
  bind(element: HTMLElement, key: keyof T | number): void {
    if (!this.bindings.has(key)) {
      this.bindings.set(key, []);
    }

    // Add the element to the list of bindings for the given key or array index
    const elements = this.bindings.get(key);
    elements?.push(element);

    // Initial render for this key or index
    this.update(key);
  }

  // Update the DOM when the signal value changes for a specific key or array index
  private update(key: keyof T | number): void {
    const boundElements = this.bindings.get(key);
    if (boundElements) {
      boundElements.forEach(element => {
        // Update element's content based on whether the signal is an array or an object
        if (Array.isArray(this.proxyValue) && typeof key === 'number') {
          element.textContent = String(this.proxyValue[key]);
        } else if (!Array.isArray(this.proxyValue) && typeof key === 'string') {
          element.textContent = String(this.proxyValue[key as keyof T]);
        }

        // Execute rendering logic
        this.performDOMRender(element, key);
      });
    }
  }

  // Internal method to perform rendering for the given element and key or array index
  private performDOMRender(element: HTMLElement, key: keyof T | number): void {
    const currentProps: { [key: string]: any } = Array.from(element.attributes).reduce((props, attr) => {
      props[attr.name] = attr.value;
      return props;
    }, {} as { [key: string]: any });

    let value: any;

    // Determine whether to render based on array or object
    if (Array.isArray(this.proxyValue) && typeof key === 'number') {
      value = this.proxyValue[key];
    } else if (!Array.isArray(this.proxyValue) && typeof key === 'string') {
      value = this.proxyValue[key as keyof T];
    }

    // Create new virtual node with the updated value for the bound key or array index
    const newVNode: VNode = createElement(
      element.tagName.toLowerCase(),
      { ...currentProps, className: element.className },
      `${value}`
    );

    // Create old virtual node with current element state
    const oldVNode: VNode = createElement(
      element.tagName.toLowerCase(),
      { ...currentProps },
      element.textContent || ''
    );

    // Perform diff and patch
    const patches = diff(oldVNode, newVNode);
    patch(element, patches);
  }

  // Trigger rendering and append the new item when adding a new item to an array
  private reRenderArr(first: boolean): void {
    // Get the first binding for key 0 since we're only dealing with arrays
    const key = 0;
    let elements = this.bindings.get(key);

    if (Array.isArray(this.proxyValue) && elements) {
      // Get the parent element of the first bound element

      if (first) {
        elements[0].innerText = this.proxyValue[0]
        return
      }

      const parentElement = elements[0].parentElement;

      // Use the classnames from the first bound element
      const classNames = elements[0].className;      

      if (this.proxyValue.length === 0) {
        // If the array is empty, clear the parent element's content
        if (parentElement) {
          parentElement.innerHTML = '';
        }
      }

      // Create the new virtual node for the last item in the array
      const newIndex = this.proxyValue.length - 1;
      const newVNode: VNode = createElement(
        elements[0].tagName.toLowerCase(), // Use the tag of the first bound element as a reference
        { class: classNames }, // Pass the classnames to the new element
        `${this.proxyValue[newIndex]}` // Set the content as the last item in the array
      );

      // Render the new item and append it to the DOM
      if (parentElement) {
        const renderedElement = render(newVNode);
        parentElement.appendChild(renderedElement); // Append the new element to the parent
      }
    }
  }
}

/**
 * A global registry to keep track of signals and their associated IDs.
 * 
 * @type {Map<string, Signal<any>>}
 */
export let signalRegistry: Map<string, Signal<any>> = new Map<string, Signal<any>>();

/**
 * Generate a new signal and add it to the global registry.
 * 
 * @template T - The type of the signal value.
 * @param {T} initialValue - The initial value for the signal.
 * @param {string} id - A unique ID to associate with the signal.
 * @returns {Signal<T>} The newly created signal.
 */
export const genSignal = <T extends object | any[]>(initialValue: T, id: string): Signal<T> => {
  const signal = new Signal<T>(initialValue);

  if (signalRegistry.get(id)) {
    throw new Error("Signal IDs must be unique");
  }

  signalRegistry.set(id, signal);

  return signal;
};
