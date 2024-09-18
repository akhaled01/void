import { createElement } from "./vDOM/createElement";
import { diff } from "./vDOM/diff";
import { patch } from "./vDOM/patch";
import { render } from "./vDOM/render";
import { VNode } from "./vDOM/types";

export class Signal<T extends object | Array<T>> {
  private proxyValue: T;
  private id: string;
  private listeners: Set<(value: T) => void>;
  private template?: (data: T) => VNode;
  private rootElement: HTMLElement | null = null; // Element to apply changes to

  constructor(initialValue: T, id: string, template?: (data: T) => VNode) {
    this.listeners = new Set();
    this.id = id;
    this.proxyValue = this.makeReactive(initialValue);
    this.template = template;
  }

  private makeReactive(value: T): T {
    const self = this;

    return new Proxy(value, {
      get(target, prop) {
        const result = Reflect.get(target, prop);
        if (result && typeof result === "object" && !Array.isArray(result)) {
          return self.makeReactive(result as T);
        }
        return result;
      },
      set(target, prop, newValue) {
        const oldValue = target[prop as keyof T];
        if (oldValue !== newValue) {
          Reflect.set(target, prop, newValue);
          self.notifyListeners();
          self.performDOMRender();  // Trigger re-render on change
        }
        return true;
      }
    });
  }

  set(newValue: T): void {
    this.proxyValue = this.makeReactive(newValue);
    this.notifyListeners();
    this.performDOMRender(); // Trigger re-render on set
  }

  get(): T {
    return this.proxyValue;
  }

  subscribe(listener: (value: T) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.proxyValue));
  }

  attachTo(element: HTMLElement): void {
    this.rootElement = element;
    this.performDOMRender(); // Initial render
  }

  private performDOMRender(): void {
    if (this.template && this.rootElement) {
      const newVNode: VNode = this.template(this.proxyValue);

      // Create a new element based on the new VNode
      const newElement = render(newVNode);      

      // Replace the old content with the new element
      if (this.rootElement.parentNode) {
        this.rootElement.parentNode.replaceChild(newElement, this.rootElement);
        this.rootElement = newElement as HTMLElement; // Update the reference to the new element
      }
    }
  }

}

/**
 * A global registry to keep track of signals and their associated IDs.
 */
export let signalRegistry: Map<string, Signal<any>> = new Map<string, Signal<any>>();

/**
 * Generate a new signal and add it to the global registry.
 */
export const genSignal = <T extends object | {}[]>(
  initialValue: T,
  id: string,
  template?: (data: T) => VNode
): Signal<T> => {
  if (signalRegistry.get(id)) {
    throw new Error("Signal IDs must be unique");
  }

  const signal = new Signal<T>(initialValue, id, template);
  signalRegistry.set(id, signal);

  return signal;
};
