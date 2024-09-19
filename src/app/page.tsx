/** @jsx createElement */
import { createElement } from "../../core/vDOM/createElement";
import { genPulse } from "../../core/pulse";
import "../css/home.css";

// Child template function for rendering each item in the array
const itemTemplate = async (item: { checked: any; toggleCheck: () => any; a: any; b: any; }, index: number) => {
  return (
    <div class={`aab${item.checked ? " checked" : ""}`}>
      <button id={`arr-button-${index}`} onClick={() => item.toggleCheck()}>Check</button>
      <p>{item.a}</p>
      <p>{item.b}</p>
      <p>{item.checked ? "Checked" : "Unchecked"}</p>
    </div>
  );
};

// Base template function that renders the entire array and the update button
const baseTemplate = async (array: { a: number; b: number; checked: boolean; toggleCheck: () => void; }[], upArr: () => void) => {
  return (
    <div>
      <div id="array-signal"></div>
      <button onClick={upArr}>Update Array</button>
    </div>
  );
};

const Page = async () => {
  const sig = genPulse(
    [
      {
        a: 1,
        b: 2,
        checked: true,
        toggleCheck: function () {
          this.checked = !this.checked; // Toggle checked state
        }
      },
    ],
    "arr",
    async (item, index) => itemTemplate(item, index) // Use the child template
  );

  // Move upArr function above its usage in baseTemplate
  const upArr = () => {
    const currentArray = sig.get();
    if (Array.isArray(currentArray)) {
      sig.addItem({
        a: 2,
        b: 3,
        checked: false,
        toggleCheck: function () {
          this.checked = !this.checked; // Toggle checked state
        }
      }); // Use addItem to append to array
    } else {
      console.error("sig does not contain an array:", currentArray);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("array-signal");
    if (rootElement) {
      sig.attachTo(rootElement);
    } else {
      console.error("Root element for sig not found");
    }
  });

  return await baseTemplate(sig.get(), upArr); // Pass upArr to the base template
};

export default Page;
