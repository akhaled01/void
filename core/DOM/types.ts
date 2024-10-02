/**
 * Represents a virtual node of type text.
 * @typedef {Object} TextVNode
 * @property {"text"} type - The type of the virtual node, which is always "text".
 * @property {string} content - The text content of the node.
 */
type TextVNode = {
  type: "text";
  content: string;
};

/**
 * Represents a virtual node of type element.
 * @typedef {Object} ElementVNode
 * @property {string} tag - The tag name of the element (e.g., "div", "span").
 * @property {Object.<string, any>} props - An object containing the attributes/props of the element.
 * @property {VNode[]} children - An array of child virtual nodes.
 */
type ElementVNode = {
  tag: string;
  props: { [key: string]: any };
  children: VNode[];
};

/**
 * Union type for virtual nodes, which can be either an ElementVNode or a TextVNode.
 * @typedef {ElementVNode | TextVNode} VNode
 */
type VNode = ElementVNode | TextVNode;

export type { VNode, ElementVNode, TextVNode };
