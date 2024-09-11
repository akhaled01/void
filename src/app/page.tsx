/** @jsx createElement */
import { createElement } from "../../core/vDOM/createElement";
import { genSignal } from "../../core/signal";
import "../css/home.css";

const Page = () => {
  const a = genSignal(0, "a")

  const incA = () => {
    a.set(a.get() + 1)
  }

  return (
    <div class="aab">
      <p>Home</p>
      <a href="/about">go to about :)</a>
      <p osiris:a></p>
      <button onClick={incA}>huh</button>
    </div>
  );
};

export default Page;
