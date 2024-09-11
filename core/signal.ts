import { createElement } from "./vDOM/createElement";
import { diff } from "./vDOM/diff";
import { patch } from "./vDOM/patch";
import { VNode } from "./vDOM/types";

/**
 * Signal class to manage reactive values and update the DOM when the value changes.
 * 
 * @template T - The type of the value held by the signal.
 */
export class Signal<T> {
  private value: T;
  private listeners: Set<(value: T) => void>;
  private element: HTMLElement | null = null;

  /**
   * Creates an instance of Signal.
   * @param {T} initialValue - The initial value of the signal.
   */
  constructor(initialValue: T) {
    this.value = initialValue;
    this.listeners = new Set();
  }

  /**
   * Get the current value of the signal.
   * @returns {T} The current value.
   * @example
   * const mySignal = new Signal(5);
   * console.log(mySignal.get()); // 5
   */
  get(): T {
    return this.value;
  }

  /**
   * Set a new value to the signal. If the value is different, it notifies all listeners and updates the DOM.
   * 
   * @param {T} newValue - The new value to set.
   * @example
   * const mySignal = new Signal(5);
   * mySignal.set(10); // Updates the value to 10 and triggers listeners.
   */
  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.listeners.forEach(listener => listener(this.value));
      this.update();
    }
  }

  /**
   * Subscribe to changes in the signal. The provided listener function is called when the signal value changes.
   * 
   * @param {(value: T) => void} listener - The listener function to call when the signal changes.
   * @returns {() => void} A function to unsubscribe the listener.
   * @example
   * const mySignal = new Signal(5);
   * const unsubscribe = mySignal.subscribe((newValue) => {
   *   console.log('Value changed to:', newValue);
   * });
   * mySignal.set(10); // Logs 'Value changed to: 10'
   * unsubscribe(); // Stops listening to changes.
   */
  subscribe(listener: (value: T) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Bind the signal to an HTML element. This element will be re-rendered when the signal changes.
   * It is not meant to be used directly
   * 
   * @param {HTMLElement} element - The element to bind to the signal.
   * @example
   * const mySignal = genSignal(5, "a");
   * return <p osiris:a>{mySignal.get()}</p>
   */
  bind(element: HTMLElement): void {
    this.element = element;
    this.update(); // Initial render
  }

  /**
   * Internal method to update the DOM based on the signal value.
   * Captures the current attributes and children of the bound element, and applies changes to it.
   * @private
   */
  private update(): void {
    if (this.element) {
      // Capture the existing attributes and children of the element
      const currentProps: { [key: string]: any } = Array.from(this.element.attributes).reduce((props, attr) => {
        props[attr.name] = attr.value;
        return props;
      }, {} as { [key: string]: any });

      const currentChildren = Array.from(this.element.childNodes).map(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          return (child as Text).textContent || "";
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          return createElement(
            (child as HTMLElement).tagName.toLowerCase(),
            Array.from((child as HTMLElement).attributes).reduce((attrs, attr) => {
              attrs[attr.name] = attr.value;
              return attrs;
            }, {} as { [key: string]: any }),
            ...Array.from((child as HTMLElement).childNodes).map(c =>
              c.nodeType === Node.TEXT_NODE
                ? (c as Text).textContent || ""
                : createElement((c as HTMLElement).tagName.toLowerCase(), {}, (c as HTMLElement).innerHTML)
            )
          );
        }
        return "";
      });

      const newVNode: VNode = createElement(
        this.element.tagName.toLowerCase(),
        { ...currentProps, className: this.element.className },
        `${this.value}`,
      );

      const oldVNode: VNode = createElement(
        this.element.tagName.toLowerCase(),
        { ...currentProps },
        ...currentChildren
      );

      const patches = diff(oldVNode, newVNode);
      patch(this.element, patches);
    }
  }
}

/**
 * A global registry to keep track of signals and their associated IDs.
 * 
 * @type {Map<string, Signal<any>>}
 * @example
 * // To store a signal:
 * const signal = new Signal(5);
 * signalRegistry.set('signal-id', signal);
 * 
 * // To retrieve a signal:
 * const retrievedSignal = signalRegistry.get('signal-id');
 */
export let signalRegistry: Map<string, Signal<any>> = new Map<string, Signal<any>>()

/**
 * Generate a new signal and adds it to the global registry.
 * 
 * @template T - The type of the signal value.
 * @param {T} initialValue - The initial value for the signal.
 * @param {string} id - A unique ID to associate with the signal.
 * @returns {Signal<T>} The newly created signal.
 * @example
 * const mySignal = genSignal(5, 'mySignal');
 * mySignal.set(10); // Updates the value to 10
 */
export const genSignal = <T>(initialValue: T, id: string): Signal<T> => {
  const signal = new Signal<T>(initialValue);

  if (signalRegistry.get(id)) {
    throw new Error("signal ids must be unique")
  }

  signalRegistry.set(id, signal);

  return signal;
};
