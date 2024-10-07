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
  private template?: (data: T, index?: number, pulseID?: string) => VNode;
  private rootElement: HTMLElement | null = null;
  childPulseMap: Map<string, Pulse<any>>; // Registry for item pulses

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
    template?: (data: T, index?: number, pulseID?: string) => VNode
  ) {
    this.listeners = new Set();
    this.id = id;
    this.proxyValue = this.makeReactive(initialValue);
    this.template = template;
    this.childPulseMap = new Map();
  }

  /**
   * Makes the given value reactive by wrapping it with a Proxy.
   *
   * @param value - The value to make reactive.
   * @returns A reactive version of the value.
   */
  private makeReactive(value: T): T {
    const self = this;

    if (!value || typeof value !== "object") {
      return value; // Return primitive values directly
    }

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
    // console.log(this.proxyValue);
    this.childPulseMap.clear();
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
  private renderObject(): void {
    const newVNode: VNode = this.template!(this.proxyValue);
    const newElement = render(newVNode);

    if (this.rootElement!.parentNode) {
      this.rootElement!.parentNode.replaceChild(newElement, this.rootElement!);
      this.rootElement = newElement as HTMLElement;
    }
  }

  /**
   * Updates or creates an item in the array.
   *
   * @param index - The index of the item to update.
   * @param newValue - The new value to set.
   */
  private updateArrayItem(index: number, newValue: any) {
    const pulseID = `${this.id}-${index}`;
    let childPulse = this.childPulseMap.get(pulseID);

    if (childPulse) {
      // If the item exists, update its value
      childPulse.set(newValue);
    }

    // else {
    //   // If the item doesn't exist, create a new Pulse and render it
    //   childPulse = new Pulse(newValue, pulseID, this.template);
    //   this.childPulseMap.set(pulseID, childPulse);

    //   const newVNode: VNode =  this.template!(newValue, index, pulseID);
    //   const newElement =  render(newVNode);

    //   // Append the new element to the array container
    //   this.rootElement?.appendChild(newElement);
    //   childPulse.attachTo(newElement as HTMLElement);
    // }
  }

  private renderArray(arr: any[]): void {
    // Only render the entire array on initial render or if explicitly called
    this.rootElement.innerHTML = "";

    arr.forEach((item, index) => {
      const pulseID = `${this.id}-${index}`;
      let childPulse = this.childPulseMap.get(pulseID);

      if (!childPulse) {
        childPulse = new Pulse(item, pulseID, this.template);
        this.childPulseMap.set(pulseID, childPulse);
      }

      const newVNode: VNode = this.template!(item, index, pulseID);
      const newElement = render(newVNode);

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
      const newIndex = (this.proxyValue as any[]).length; // Calculate new index
      (this.proxyValue as any[]).push(item); // Add the item to the array

      // Call updateArrayItem only to create and attach the new child pulse
      // this.updateArrayItem(newIndex, item);

      const pulseID = `${this.id}-${newIndex}`;

      let childPulse = new Pulse(item, pulseID, this.template);
      this.childPulseMap.set(pulseID, childPulse);

      if (this.template) {
        const newVNode: VNode = this.template!(item, newIndex, pulseID);
        const newElement = render(newVNode);

        // Append the new element to the array container
        this.rootElement?.appendChild(newElement);
        childPulse.attachTo(newElement as HTMLElement);
      }

      // Rebuild the registry to ensure proper indexing and notify listeners
      this.rebuildRegistry();
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
      const newArray = (this.proxyValue as any[]).filter((_, i) => i !== index);

      // Update the proxyValue with the new array
      this.proxyValue = this.makeReactive(newArray as unknown as T);

      // Rebuild the child pulse registry after removing the item
      this.rebuildRegistry();

      // Notify listeners and trigger a full re-render after the array is modified
      this.notifyListeners();
      this.performDOMRender();
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
      this.updateArrayItem(index, newValue); // Update only the specific item
      this.notifyListeners();
    }
  }

  /**
   * Rebuilds the child pulse registry to reset the indexes properly.
   */
  private rebuildRegistry(): void {
    this.childPulseMap.clear();
    if (Array.isArray(this.proxyValue)) {
      this.proxyValue.forEach((item, index) => {
        if (item) {
          const pulseID = `${this.id}-${index}`;
          const childPulse = new Pulse(item, pulseID, this.template);
          this.childPulseMap.set(pulseID, childPulse);
        }
      });
    }
  }
}

/**
 * A global registry to keep track of pulses and their associated IDs.
 */
export const pulseRegistry: Map<string, Pulse<any>> = new Map<
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
 *
 * @example
 * const todos = genPulse([], "todos", todoListTemplate, () => <div>Child</div>);
 */
export const genPulse = <T extends object | Array<any>>(
  initialValue: T,
  id: string,
  baseTemplate?: (data: any, index?: number, pulseID?: string) => VNode,
  childTemplate?: (data: any, index?: number, pulseID?: string) => VNode
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
