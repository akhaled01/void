/** @jsx createElement */
import { createElement } from "../../core/vDOM/createElement";
import { genSignal } from "../../core/signal";
import "../css/home.css";

const Page = () => {
  const signal = genSignal({ name: "Osiris", age: 25 }, "user");
  const anotherSignal = genSignal({ val: 90 }, "anotha");
  const arraySignal = genSignal([null], "arr");

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
    arraySignal.addItem(Number((Math.random() * 10).toFixed(0)));
  };

  return (
    <div class="aab">
      <p osiris:user="name"></p>
      <p osiris:user="age"></p>
      <p osiris:anotha="val"></p>
      <div class="za">
        <div class="aab" osiris:arr></div>
      </div>
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateAge}>Update Age</button>
      <button onClick={updateVal}>update Val</button>
      <button onClick={upArr}>update arr</button>
    </div>
  );
};

export default Page;
