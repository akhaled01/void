type Props = {
  [key: string]: any;
};

type ElementOrString = HTMLElement | string;

export const createElement = (
  tag: string | ((props: Props) => HTMLElement),
  props: Props = {},
  ...children: ElementOrString[]
): HTMLElement => {
  if (typeof tag === "function") {
    return tag(props);
  }

  const element = document.createElement(tag);

  props = props || {};

  // Set attributes
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      // Event listeners
      element.addEventListener(key.slice(2).toLowerCase(), props[key]);
    } else {
      // Set other properties
      element.setAttribute(key, props[key]);
    }
  });

  // Append child elements
  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  }

  return element;
};
