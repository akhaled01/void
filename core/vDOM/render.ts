import { signalRegistry } from "../signal";
import { VNode, ElementVNode, TextVNode } from "./types";

/**
 * Renders a VNode to a real DOM node.
 *
 * @param vNode - The virtual DOM node to render.
 * @returns The corresponding real DOM node.
 */
export const render = (vNode: VNode): HTMLElement | Text | DocumentFragment => {
    if (isTextVNode(vNode)) {
        const textVNode = vNode as TextVNode;
        return document.createTextNode(textVNode.content);
    } else if (isElementVNode(vNode)) {
        const elementVNode = vNode as ElementVNode;
        const { tag, props, children } = elementVNode;
        const element = document.createElement(tag);

        if (Array.isArray(children)) {
            children.forEach((child) => {
                const childElement = render(child);
                if (childElement) {
                    element.appendChild(childElement);
                }
            });
        }

        // Set properties/attributes
        if (props) {
            for (const [key, value] of Object.entries(props)) {
                if (key.startsWith("on") && typeof value === "function") {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else if (value === null) {
                    element.removeAttribute(key);
                } else if (key.startsWith("osiris:")) {
                    const signalID = key.replace("osiris:", "");
                    const signal = signalRegistry.get(signalID);

                    if (!signal) {
                        throw new Error(`No signal associated with ${signalID}`);
                    }

                    // If `value` is an index for array elements, bind it
                    if (!isNaN(Number(value))) {
                        const index = Number(value);

                        // Get the array from the signal
                        const arrayValue = signal.get();
                        if (Array.isArray(arrayValue)) {
                            const item = arrayValue[index];

                            signal.bind(element, value);

                            // Bind individual fields from the array item to the elements
                            if (typeof item === "object" && item !== null) {
                                for (const [itemKey, itemValue] of Object.entries(item)) {
                                    const itemElement = element.querySelector(
                                        `[data-osiris-${signalID}="${itemKey}"]`
                                    );
                                    if (itemElement) {
                                        // Bind the itemElement to the respective object key
                                        signal.bind(itemElement as HTMLElement, itemKey);

                                        // Populate the itemElement with the respective value
                                        (itemElement as HTMLElement).textContent = String(itemValue);
                                    }
                                }
                            }
                        }
                    } else {
                        // If not an array, bind to the specific key
                        signal.bind(element, value);
                    }
                } else {
                    element.setAttribute(key, value);
                }
            }
        }
        return element;
    }

    // throw new Error("Invalid VNode: Missing required fields or incorrect type");
};

// Type guards to differentiate between VNode types
const isTextVNode = (vNode: VNode): vNode is TextVNode => {
    return (vNode as TextVNode).type === "text";
};

const isElementVNode = (vNode: VNode): vNode is ElementVNode => {
    return (vNode as ElementVNode).tag !== undefined;
};
