/** @jsx createElement */
import { createElement } from "../../core/vDOM/createElement";
import { genSignal } from "../../core/signal";
import "../css/home.css";

const Page = () => {
  const signal = genSignal({ name: "Osiris", age: 25 }, "user");
  const anotherSignal = genSignal({ val: 90 }, "anotha");

  const updateName = () => {
    signal.get().name += "o";
  };

  const updateAge = () => {
    signal.get().age += 1;
  };

  const updateVal = () => {
    anotherSignal.get().val += 4
  }

  return (
    <div class="aab">
      <p osiris:user="name"></p>
      <p osiris:user="age"></p>
      <p osiris:anotha="val"></p>
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateAge}>Update Age</button>
      <button onClick={updateVal}>update Val</button>
    </div>
  );
};

export default Page;
