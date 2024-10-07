/** @jsx createElement */
import logo from "Assets/logo.png";

const Page = () => {
  document.listen("DOMContentLoaded", () => {
    document.getElementById("void-text").listen("click", () => {
      window.location.href = "https://github.com/akhaled01/void";
    });
  });

  return (
    <div className="container">
      <main>
        <div className="logo">
          <img
            src={logo}
            alt="Void.js Logo"
            style={{ width: "100px", height: "100px" }}
            className="glow-img"
            priority
          />
        </div>
        <div className="cta">
          <h1>
            This is a new{" "}
            <span className="void-text ibm-plex-mono-thin" id="void-text">
              Void.js
            </span>{" "}
            Application!
          </h1>
          <p className="description">
            Start by editing <code>src/app/page.tsx</code>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Page;
