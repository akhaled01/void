/** @jsx createElement */

const Page = () => {
  return (
    <div className="container">
      <header>
        <div className="logo ibm-plex-mono-regular-italic">Vortex.js</div>
        <nav>
          <ul>
            <li>
              <a href="/todo">todoMVC</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>
            Build the Future with{" "}
            <span className="ibm-plex-mono-semibold-italic">Vortex</span>
          </h1>
          <p className="tagline">
            A minimal, powerful JavaScript framework for modern web applications
          </p>
          <a href="https://github.com/akhaled01/vortex" className="cta">
            Get Started
          </a>
        </section>

        <section className="features" id="features">
          <div className="feature">
            <h3>Lightning Fast</h3>
            <p>
              Vortex.js is optimized for speed, ensuring your applications load
              and run quickly.
            </p>
          </div>
          <div className="feature">
            <h3>Easy to Learn</h3>
            <p>
              With a gentle learning curve, you'll be building amazing apps in
              no time.
            </p>
          </div>
          <div className="feature">
            <h3>Unopinionated</h3>
            <p>
              Adapt Vortex.js to your needs with its modular and extensible
              architecture.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
