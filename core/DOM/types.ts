
// Define the shape of a text node
type TextVNode = {
    type: 'text';
    content: string;
}

// Define the shape of an element node
type ElementVNode = {
    tag: string;
    props: { [key: string]: any };
    children: VNode[];
};

// Union type for VNode, which can be either an ElementVNode or a TextVNode
type VNode = ElementVNode | TextVNode;

export type { VNode, ElementVNode, TextVNode };
