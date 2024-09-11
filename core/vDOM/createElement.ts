import { VNode, ElementVNode } from './types';

/**
 * Creates a virtual DOM element.
 *
 * @param tag - The HTML tag name.
 * @param props - The properties/attributes of the element.
 * @param children - The child elements or text nodes.
 * @returns A VNode representing the element.
 */
export const createElement = <P = { [key: string]: any }>(
  tag: string,
  props: P = {} as P,
  ...children: (VNode | string)[]
): ElementVNode => {
  const flatChildren: (VNode | string)[] = children.flat();

  const formattedChildren: VNode[] = flatChildren.map((child) =>
    typeof child === 'object'
      ? child
      : {
        type: 'text',
        content: child,
      }
  );

  return {
    tag,
    props,
    children: formattedChildren,
  };
};
