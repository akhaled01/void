import { createElement } from "./vDOM/createElement";
import { diff } from "./vDOM/diff";
import { patch } from "./vDOM/patch";
import { VNode } from "./vDOM/types";

export class Signal<T extends object> {
  private proxyValue: T;
  private listeners: Set<(value: T) => void>;
  private bindings: Map<keyof T, HTMLElement[]> = new Map(); // Track bindings for each key separately

  constructor(initialValue: T) {
    this.listeners = new Set();
    this.proxyValue = this.makeReactive(initialValue); // Make object reactive
  }

  // Make the object reactive using Proxy
  private makeReactive(value: T): T {
    const self = this;

    return new Proxy(value, {
      get(target, prop) {
        const result = Reflect.get(target, prop);

        // Ensure result is an object, not null, and not an array
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
          self.update(prop as keyof T); // Re-render the bound elements for this property
        }
        return true;
      }
    });
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

  // Bind the signal to an element and a specific property
  bind(element: HTMLElement, key: keyof T): void {
    if (!this.bindings.has(key)) {
      this.bindings.set(key, []);
    }

    // Add the element to the list of bindings for the given key
    const elements = this.bindings.get(key);
    elements?.push(element);

    // Initial render for this key
    this.update(key);
  }

  // Update the DOM when the signal value changes for a specific key
  private update(key: keyof T): void {
    const boundElements = this.bindings.get(key);
    if (boundElements) {
      boundElements.forEach(element => {
        // Update element's content with the new value of the bound key
        element.textContent = String(this.proxyValue[key]);

        // Execute rendering logic
        this.performDOMRender(element, key);
      });
    }
  }

  // Internal method to perform rendering for the given element and key
  private performDOMRender(element: HTMLElement, key: keyof T): void {
    const currentProps: { [key: string]: any } = Array.from(element.attributes).reduce((props, attr) => {
      props[attr.name] = attr.value;
      return props;
    }, {} as { [key: string]: any });

    // Create new virtual node with the updated value for the bound key
    const newVNode: VNode = createElement(
      element.tagName.toLowerCase(),
      { ...currentProps, className: element.className },
      `${this.proxyValue[key]}`
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
export const genSignal = <T extends object>(initialValue: T, id: string): Signal<T> => {
  const signal = new Signal<T>(initialValue);

  if (signalRegistry.get(id)) {
    throw new Error("Signal IDs must be unique");
  }

  signalRegistry.set(id, signal);

  return signal;
};
