import { render } from "./DOM/render";
import { VNode } from "./DOM/types";

export class Pulse<T extends object | Array<any>> {
  private proxyValue: T;
  private id: string;
  private listeners: Set<(value: T) => void>;
  private template?: (data: T, index?: number, signalId?: string) => Promise<VNode>;
  private rootElement: HTMLElement | null = null;
  itemSignalRegistry: Map<string, Pulse<any>> // Registry for item pulses

  constructor(initialValue: T, id: string, template?: (data: T, index?: number, signalId?: string) => Promise<VNode>) {
    this.listeners = new Set();
    this.id = id;
    this.proxyValue = this.makeReactive(initialValue);
    this.template = template;
    this.itemSignalRegistry = new Map();
  }

  private makeReactive(value: T): T {
    const self = this;

    return new Proxy(value, {
      get(target, prop) {
        const result = Reflect.get(target, prop);

        if (Array.isArray(result)) {
          return result.map(item => self.makeReactive(item));
        } else if (result && typeof result === "object") {
          return self.makeReactive(result as T);
        }
        return result;
      },
      set(target, prop, newValue) {
        const oldValue = Reflect.get(target, prop);

        if (oldValue !== newValue) {
          Reflect.set(target, prop, newValue);
          self.notifyListeners();
          if (Array.isArray(target)) {
            self.updateArrayItem(Number(prop), newValue);
          } else {
            self.performDOMRender();
          }
        }
        return true;
      }
    });
  }

  set(newValue: T): void {
    this.proxyValue = this.makeReactive(newValue);
    this.notifyListeners();
    this.performDOMRender();
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
    this.performDOMRender();
  }

  private performDOMRender(): void {
    if (this.template && this.rootElement) {
      if (Array.isArray(this.proxyValue)) {
        this.renderArray(this.proxyValue);
      } else {
        this.renderObject();
      }
    }
  }

  private async renderObject(): Promise<void> {
    const newVNode: VNode = await this.template!(this.proxyValue);
    const newElement = await render(newVNode);

    if (this.rootElement!.parentNode) {
      this.rootElement!.parentNode.replaceChild(newElement, this.rootElement!);
      this.rootElement = newElement as HTMLElement;
    }
  }

  private async renderArray(arr: any[]): Promise<void> {
    while (this.rootElement?.firstChild) {
      this.rootElement.removeChild(this.rootElement.firstChild);
    }

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

  private async updateArrayItem(index: number, newValue: any) {
    const signalId = `${this.id}-${index}`;
    let childPulse = this.itemSignalRegistry.get(signalId);

    if (childPulse) {
      childPulse.set(newValue); // Update only the specific array item
    } else {
      // Create a new pulse for the item if it doesn't exist
      childPulse = new Pulse(newValue, signalId, this.template);
      this.itemSignalRegistry.set(signalId, childPulse);

      const newVNode: VNode = await this.template!(newValue, index, signalId);
      const newElement = await render(newVNode);
      this.rootElement?.appendChild(newElement); // Append the new element to the root
      childPulse.attachTo(newElement as HTMLElement);
    }
  }

  addItem(item: any): void {
    if (Array.isArray(this.proxyValue)) {
      (this.proxyValue as any[]).push(item);
      const newIndex = (this.proxyValue as any[]).length - 1;
      this.updateArrayItem(newIndex, item); // Update only the new item
      this.notifyListeners();
    }
  }

  updateItem(index: number, newValue: any): void {
    if (Array.isArray(this.proxyValue) && index >= 0 && index < (this.proxyValue as any[]).length) {
      (this.proxyValue as any[])[index] = newValue;
      this.updateArrayItem(index, newValue); // Update only the specified item
      this.notifyListeners();
    }
  }

  removeItem(index: number): void {
    if (Array.isArray(this.proxyValue) && index >= 0 && index < (this.proxyValue as any[]).length) {
      (this.proxyValue as any[]).splice(index, 1); // Remove the item from the array
      this.itemSignalRegistry.delete(`${this.id}-${index}`);
      this.rootElement?.removeChild(this.rootElement.children[index]); // Remove the corresponding DOM element
      this.notifyListeners();
    }
  }
}

/**
 * A global registry to keep track of pulses and their associated IDs.
 */
export let pulseRegistry: Map<string, Pulse<any>> = new Map<string, Pulse<any>>();

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
  baseTemplate?: (data: any, index?: number, signalId?: string) => Promise<VNode>,
  childTemplate?: (data: any, index?: number, signalId?: string) => Promise<VNode>
): Pulse<T> => {
  if (pulseRegistry.get(id)) {
    throw new Error("Pulse IDs must be unique");
  }

  const template = Array.isArray(initialValue) && childTemplate ? childTemplate : baseTemplate;
  const pulse = new Pulse<T>(initialValue, id, template);

  pulseRegistry.set(id, pulse);

  return pulse;
};
