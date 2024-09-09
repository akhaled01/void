export const createElement = (tag, props = {}, ...children) => {
  if (typeof tag === "function") {
    // If tag is a function, it's a custom component
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
      element[key] = props[key];
    }
  });

  // Append child elements
  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
};

