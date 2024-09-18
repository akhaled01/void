/** @jsx createElement */
import { createElement } from "../../core/vDOM/createElement";
import { genSignal } from "../../core/signal";
import "../css/home.css";

const Page = () => {
  const signal = genSignal({ name: "Osiris", age: 25 }, "user", (d) => (
    <div>
      <div>{d.age}</div>
      <div>{d.name}</div>
    </div>
  ));

  const anotherSignal = genSignal({ val: 90 }, "anotha", (d) => <p>{d.val}</p>);

  const arraySignal = genSignal(
    [
      {
        a: 1,
        b: 2,
      },
      {
        a: 2,
        b: 3,
      },
    ],
    "arr",
    (arr) => (
      <div>
        {arr.map((item) => (
          <div class="aab">
            <p>{item.a}</p>
            <p>{item.b}</p>
          </div>
        ))}
      </div>
    )
  );

  const updateName = () => {
    signal.get().name += "o";
  };

  const updateAge = () => {
    signal.get().age += 1;
  };

  const updateVal = () => {
    anotherSignal.get().val += 4;
  };

  const upArr = () => {
    arraySignal.set([
      ...arraySignal.get(),
      {
        a: 2,
        b: 3,
      },
    ]);
  };

  document.addEventListener('DOMContentLoaded', () => {
    console.log("attaching");
    
    signal.attachTo(document.getElementById("user-signal"));
    anotherSignal.attachTo(document.getElementById("another-signal"));
    arraySignal.attachTo(document.getElementById("array-signal"));
  })

  return (
    <div class="aab">
      <div id="user-signal"></div>
      <div id="another-signal"></div>
      <div id="array-signal"></div>

      <button onClick={updateName}>Update Name</button>
      <button onClick={updateAge}>Update Age</button>
      <button onClick={updateVal}>Update Val</button>
      <button onClick={upArr}>Update Array</button>
    </div>
  );
};

export default Page;
