import { ElementVNode, VNode } from "./types";

export type Patch =
    | { type: 'CREATE'; newNode: VNode; index: number }
    | { type: 'REMOVE'; index: number }
    | { type: 'REPLACE'; newNode: VNode; index: number }
    | { type: 'UPDATE_PROPS'; props: { [key: string]: any }; index: number }
    | { type: 'UPDATE_TEXT'; newText: string; index: number };

// The diff function
export const diff = (oldNode: VNode | string | undefined, newNode: VNode | string | undefined): Patch[] => {
    const patches: Patch[] = [];
    walk(oldNode, newNode, patches, 0);
    return patches;
};

// Walk through old and new nodes to compare and generate patches
const walk = (oldNode: VNode | string | undefined, newNode: VNode | string | undefined, patches: Patch[], index: number) => {
    if (!oldNode && newNode && typeof newNode !== 'string') {
        console.log("CREATE patch added for index", index); // Debugging log
        patches.push({ type: "CREATE", newNode, index });
    } else if (!newNode) {
        patches.push({ type: 'REMOVE', index });
    } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
        if (oldNode !== newNode) {
            // Text node changed
            
            patches.push({ type: 'UPDATE_TEXT', newText: newNode, index });
        }
    } else if ((typeof oldNode !== typeof newNode || changed(oldNode, newNode)) && typeof newNode !== "string") {
        patches.push({ type: 'REPLACE', newNode, index });
    } else if ((oldNode as ElementVNode).tag) {
        // If they are both DOM elements, check props and children
        const propsPatches = diffProps((oldNode as ElementVNode).props, (newNode as ElementVNode).props);
        if (Object.keys(propsPatches).length > 0) {
            patches.push({ type: 'UPDATE_PROPS', props: propsPatches, index });
        }

        const oldChildren = (oldNode as ElementVNode).children || [];
        const newChildren = (newNode as ElementVNode).children || [];

        const length = Math.max(oldChildren.length, newChildren.length);
        for (let i = 0; i < length; i++) {
            walk(oldChildren[i], newChildren[i], patches, i);
        }
    }
};

// Check if two nodes have changed
const changed = (node1: VNode | string, node2: VNode | string): boolean => {
    if (typeof node1 !== typeof node2) {
        return true;
    }

    if (typeof node1 === 'string' || 'type' in node1) {
        return node1 !== node2;
    }

    return (node1 as ElementVNode).tag !== (node2 as ElementVNode).tag;
};

// Compare properties between old and new nodes
const diffProps = (oldProps: { [key: string]: any }, newProps: { [key: string]: any }): { [key: string]: any } => {
    const patches: { [key: string]: any } = {};

    // Add or update props
    for (const key in newProps) {
        if (oldProps[key] !== newProps[key]) {
            patches[key] = newProps[key];
        }
    }

    // Remove old props that are not in the new node
    for (const key in oldProps) {
        if (!(key in newProps)) {
            patches[key] = null;
        }
    }

    return patches;
};
