/** @jsx createElement */
import { createElement } from "Core/DOM/createElement";
import { genPulse } from "Core/pulse";
import { Signal } from "Core/signal";
import "CSS/home.css";

const Page = async () => {
  return (
    <div class="container">
      <header>
        <div class="logo ibm-plex-mono-regular-italic">OSIRIS.js</div>
        <nav>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#docs">Docs</a></li>
            <li><a href="/todo">Example</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section class="hero">
          <h1>Build the Future with <span class="ibm-plex-mono-semibold-italic">Osiris</span></h1>
          <p class="tagline">A minimal, powerful JavaScript framework for modern web applications</p>
          <a href="https://github.com/akhaled01/OSIRIS.JS" class="cta">Get Started</a>
        </section>

        <section class="features" id="features">
          <div class="feature">
            <h3>Lightning Fast</h3>
            <p>Osiris.js is optimized for speed, ensuring your applications load and run quickly.</p>
          </div>
          <div class="feature">
            <h3>Easy to Learn</h3>
            <p>With a gentle learning curve, you'll be building amazing apps in no time.</p>
          </div>
          <div class="feature">
            <h3>Unopinionated</h3>
            <p>Adapt Osiris.js to your needs with its modular and extensible architecture.</p>
          </div>
        </section>
      </main>
    </div>
  )
};

export default Page;
