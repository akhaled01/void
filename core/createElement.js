export const createElement = (tag, props = {}, ...children) => {
  const element = document.createElement(tag);

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
  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}
