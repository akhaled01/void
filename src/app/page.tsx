/** @jsx createElement */
import logo from "Assets/logo.png";
import "../../globals.css";

const Page = () => {
  document.listen("DOMContentLoaded", () => {
    document.getElementById("void-text").listen("click", () => {
      window.location.href = "https://github.com/akhaled01/void";
    });
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#111111] text-white">
      <main className="flex flex-col justify-center items-center py-20">
        <div className="mb-12">
          <img
            src={logo}
            alt="Void.js Logo"
            className="w-24 h-24 md:w-72 md:h-auto rounded-lg filter drop-shadow-glow transition-all duration-500 animate-rotate ease-in-out hover:drop-shadow-glow-hover"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            This is a new{" "}
            <span
              className="bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent cursor-pointer ibm-plex-mono-thin"
              id="void-text"
            >
              Void.js
            </span>{" "}
            Application!
          </h1>
          <p className="text-lg md:text-xl text-center">
            Start by editing{" "}
            <code className="bg-neutral-800 border border-neutral-600 rounded px-1 text-pink-400 ibm-plex-mono-thin">
              src/app/page.tsx
            </code>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Page;
