import { Patch } from './diff';
import { render } from './render';
import { TextVNode } from './types';

/**
 * Applies a list of patches to the root DOM element.
 *
 * @param root - The root DOM element to apply patches to.
 * @param patches - An array of patches generated by the diff function.
 */
export const patch = (root: HTMLElement, patches: Patch[]): void => {
    patches.forEach((p) => applyPatch(root, p));
};

/**
 * Applies a single patch to the parent DOM element.
 *
 * @param parent - The parent DOM element.
 * @param patch - The patch to apply.
 */
const applyPatch = (parent: HTMLElement, patch: Patch): void => {
    switch (patch.type) {
        case 'CREATE': {
            const newElement = render(patch.newNode);
            parent.appendChild(newElement);
            break;
        }
        case 'REMOVE': {
            const childToRemove = parent.childNodes[patch.index];
            if (childToRemove) {
                parent.removeChild(childToRemove);
            }
            break;
        }
        case 'REPLACE': {
            const childToReplace = parent.childNodes[patch.index];
            if (childToReplace) {
                if (childToReplace.nodeType === Node.TEXT_NODE) {
                    // Replace text node
                    const newTextNode = document.createTextNode((patch.newNode as TextVNode).content || '');
                    parent.replaceChild(newTextNode, childToReplace);
                    
                } else {
                    // Replace non-text node
                    const replacement = render(patch.newNode);
                    parent.replaceChild(replacement, childToReplace);
                }
            }
            break;
        }
        case 'UPDATE_PROPS': {
            const targetNode = parent.childNodes[patch.index] as HTMLElement;
            if (targetNode && targetNode instanceof HTMLElement) {
                for (const [key, value] of Object.entries(patch.props)) {
                    if (value === null) {
                        targetNode.removeAttribute(key);
                    } else {
                        targetNode.setAttribute(key, value);
                    }
                }
            }
            break;
        }
        case 'UPDATE_TEXT': {
            const targetNode = parent.childNodes[patch.index];
            if (targetNode) {
                if (targetNode.nodeType === Node.TEXT_NODE) {
                    // Update text content if it's a text node
                    if (patch.newText !== undefined && targetNode.textContent !== patch.newText) {
                        targetNode.textContent = patch.newText;
                    }
                } else {
                    // Replace non-text node with a new text node
                    const newTextNode = document.createTextNode(patch.newText || '');
                    if (targetNode.parentNode) {
                        targetNode.parentNode.replaceChild(newTextNode, targetNode);
                    }
                }
            } else {
                // If no existing node is found, append a new text node
                const newTextNode = document.createTextNode(patch.newText || '');
                parent.appendChild(newTextNode);
            }
            break;
        }
        default:
            // If patch type is unknown, do nothing
            break;
    }
};