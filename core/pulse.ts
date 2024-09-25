import { render } from "./DOM/render";
import { VNode } from "./DOM/types";

/**
 * The `Pulse` class is a reactive data-binding utility that synchronizes changes to its internal
 * data model with the DOM. It supports both objects and arrays, enabling reactivity and rendering
 * of data in the DOM.
 *
 * @template T - Type of the data model which can be an object or an array.
 */
export class Pulse<T extends object | Array<any>> {
  private proxyValue: T;
  private id: string;
  private listeners: Set<(value: T) => void>;
  private template?: (
    data: T,
    index?: number,
    signalId?: string
  ) => Promise<VNode>;
  private rootElement: HTMLElement | null = null;
  itemSignalRegistry: Map<string, Pulse<any>>; // Registry for item pulses

  /**
   * Constructs a `Pulse` instance.
   *
   * @param initialValue - The initial value of the data model.
   * @param id - A unique identifier for this Pulse instance.
   * @param template - An optional template function to render the data.
   */
  constructor(
    initialValue: T,
    id: string,
    template?: (data: T, index?: number, signalId?: string) => Promise<VNode>
  ) {
    this.listeners = new Set();
    this.id = id;
    this.proxyValue = this.makeReactive(initialValue);
    this.template = template;
    this.itemSignalRegistry = new Map();
  }

  /**
   * Makes the given value reactive by wrapping it with a Proxy.
   *
   * @param value - The value to make reactive.
   * @returns A reactive version of the value.
   */
  private makeReactive(value: T): T {
    const self = this;

    return new Proxy(value, {
      get(target, prop) {
        const result = Reflect.get(target, prop);

        if (Array.isArray(result)) {
          return result.map((item) => self.makeReactive(item));
        } else if (result && typeof result === "object") {
          return self.makeReactive(result as T);
        }
        return result;
      },
      set(target, prop, newValue) {
        const oldValue = Reflect.get(target, prop);

        if (oldValue !== newValue) {
          const isArray = Array.isArray(target);
          const propIndex = isArray ? Number(prop) : prop;

          Reflect.set(target, prop, newValue);

          // If it's an array, update the specific item and not the entire array
          if (isArray && typeof propIndex === "number") {
            self.updateArrayItem(propIndex, newValue);
          } else {
            // For non-array objects, trigger a full render
            self.performDOMRender();
          }

          // Notify listeners regardless of whether it's an array or object
          self.notifyListeners();
        }
        return true;
      },
    });
  }

  /**
   * Sets a new value for the Pulse instance and triggers re-rendering.
   *
   * @param newValue - The new value to set.
   */
  set(newValue: T): void {
    this.proxyValue = this.makeReactive(newValue);
    this.itemSignalRegistry.clear();
    this.notifyListeners();
    this.performDOMRender();
  }

  /**
   * Gets the current value of the Pulse instance.
   *
   * @returns The current value.
   */
  get(): T {
    return this.proxyValue;
  }

  /**
   * Subscribes a listener function to changes in the Pulse value.
   *
   * @param listener - The listener function to subscribe.
   * @returns A function to unsubscribe the listener.
   */
  subscribe(listener: (value: T) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifies all subscribed listeners of a change in the Pulse value.
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.proxyValue));
  }

  /**
   * Attaches the Pulse instance to a DOM element and performs initial rendering.
   *
   * @param element - The DOM element to attach to.
   */
  attachTo(element: HTMLElement): void {
    this.rootElement = element;
    this.performDOMRender();
  }

  /**
   * Performs DOM rendering based on the current value and template.
   */
  performDOMRender(): void {
    if (this.template && this.rootElement) {
      if (Array.isArray(this.proxyValue)) {
        this.renderArray(this.proxyValue);
      } else {
        this.renderObject();
      }
    }
  }

  /**
   * Renders an object value and replaces the current DOM element.
   */
  private async renderObject(): Promise<void> {
    const newVNode: VNode = await this.template!(this.proxyValue);
    const newElement = await render(newVNode);

    if (this.rootElement!.parentNode) {
      this.rootElement!.parentNode.replaceChild(newElement, this.rootElement!);
      this.rootElement = newElement as HTMLElement;
    }
  }

  /**
   * Renders an array value and updates the DOM elements.
   *
   * @param arr - The array to render.
   */
  private async updateArrayItem(index: number, newValue: any) {
    const signalId = `${this.id}-${index}`;
    let childPulse = this.itemSignalRegistry.get(signalId);

    if (childPulse) {
      // Update only the specific item
      childPulse.set(newValue);
    } else {
      // If the item doesn't exist, create a new Pulse and render it
      childPulse = new Pulse(newValue, signalId, this.template);
      this.itemSignalRegistry.set(signalId, childPulse);

      const newVNode: VNode = await this.template!(newValue, index, signalId);
      const newElement = await render(newVNode);

      // Append the new element to the array container
      this.rootElement?.appendChild(newElement);
      childPulse.attachTo(newElement as HTMLElement);
    }
  }

  private async renderArray(arr: any[]): Promise<void> {
    // Only render the entire array on initial render or if explicitly called
    this.rootElement.innerHTML = "";

    arr.forEach(async (item, index) => {
      const signalId = `${this.id}-${index}`;
      let childPulse = this.itemSignalRegistry.get(signalId);

      if (!childPulse) {
        childPulse = new Pulse(item, signalId, this.template);
        this.itemSignalRegistry.set(signalId, childPulse);
      }

      const newVNode: VNode = await this.template!(item, index, signalId);
      const newElement = await render(newVNode);

      this.rootElement?.appendChild(newElement);
      childPulse.attachTo(newElement as HTMLElement);
    });
  }

  /**
   * Adds a new item to the array and renders it.
   *
   * @param item - The item to add.
   */
  addItem(item: any): void {
    if (Array.isArray(this.proxyValue)) {
      (this.proxyValue as any[]).push(item);
      const newIndex = (this.proxyValue as any[]).length - 1;
      this.updateArrayItem(newIndex, item); // Update only the new item
      this.notifyListeners();
    }
  }

  /**
   * Updates an existing item in the array.
   *
   * @param index - The index of the item to update.
   * @param newValue - The new value to set.
   */
  updateItem(index: number, newValue: any): void {
    if (
      Array.isArray(this.proxyValue) &&
      index >= 0 &&
      index < (this.proxyValue as any[]).length
    ) {
      (this.proxyValue as any[])[index] = newValue;
      this.updateArrayItem(index, newValue); // Update only the specified item
      this.notifyListeners();
    }
  }

  /**
   * Removes an item from the array by index and updates the DOM.
   *
   * @param index - The index of the item to remove.
   */
  removeItem(index: number): void {
    if (Array.isArray(this.proxyValue)) {
      (this.proxyValue as any[]).splice(index, 1); // Remove the item from the array

      // Update the itemSignalRegistry and defer DOM updates until full render
      this.itemSignalRegistry.delete(`${this.id}-${index}`);
      this.notifyListeners();
      this.performDOMRender(); // Trigger a full re-render after the array is modified
    }
  }
}

/**
 * A global registry to keep track of pulses and their associated IDs.
 */
export let pulseRegistry: Map<string, Pulse<any>> = new Map<
  string,
  Pulse<any>
>();

/**
 * Generate a new pulse and add it to the global registry.
 *
 * @param initialValue The initial value of the pulse.
 * @param id The unique ID of the pulse.
 * @param baseTemplate The base template for rendering the parent object.
 * @param childTemplate A template specifically for child items, if applicable.
 */
export const genPulse = <T extends object | Array<any>>(
  initialValue: T,
  id: string,
  baseTemplate?: (
    data: any,
    index?: number,
    signalId?: string
  ) => Promise<VNode>,
  childTemplate?: (
    data: any,
    index?: number,
    signalId?: string
  ) => Promise<VNode>
): Pulse<T> => {
  if (pulseRegistry.get(id)) {
    return pulseRegistry.get(id);
  }

  const template =
    Array.isArray(initialValue) && childTemplate ? childTemplate : baseTemplate;
  const pulse = new Pulse<T>(initialValue, id, template);

  pulseRegistry.set(id, pulse);

  return pulse;
};
