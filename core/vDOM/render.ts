import { signalRegistry } from '../signal';
import { VNode, ElementVNode, TextVNode } from './types';

/**
 * Renders a VNode to a real DOM node.
 *
 * @param vNode - The virtual DOM node to render.
 * @returns The corresponding real DOM node.
 */
export const render = (vNode: VNode): HTMLElement | Text => {
    if (isTextVNode(vNode)) {
        const textVNode = vNode as TextVNode;
        return document.createTextNode(textVNode.content);
    } else if (isElementVNode(vNode)) {
        // Handle element nodes
        const elementVNode = vNode as ElementVNode;
        const { tag, props, children } = elementVNode;
        const element = document.createElement(tag);

        // Set properties/attributes
        if (props) {
            for (const [key, value] of Object.entries(props)) {
                if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2).toLowerCase(), value);
                } else if (value === null) {
                    element.removeAttribute(key);
                } else if (key.startsWith('osiris:')) {
                    const signalID = key.replace("osiris:", "");
                    const signal = signalRegistry.get(signalID)
                    if (!signal) {
                        throw new Error(`there is no signal associated with ${key}`)
                    }
                    signal.bind(element)
                }
                else {
                    element.setAttribute(key, value);
                }
            }
        }

        // Render and append children
        if (Array.isArray(children)) {
            children.forEach((child) => {
                try {
                    element.appendChild(render(child));
                } catch (error) {
                    console.error(`Error rendering child node: ${error}`);
                }
            });
        }

        return element;
    }

    throw new Error('Invalid VNode: Missing required fields or incorrect type');
};

// Type guards to differentiate between VNode types
const isTextVNode = (vNode: VNode): vNode is TextVNode => {
    return (vNode as TextVNode).type === 'text';
};

const isElementVNode = (vNode: VNode): vNode is ElementVNode => {
    return (vNode as ElementVNode).tag !== undefined;
};
