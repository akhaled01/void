import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Unopinonated",
    Svg: require("@site/static/img/void-light.svg").default,
    description: (
      <>
        void was designed to be very unopinionated, allowing you to modify it in
        any way you see fit. Don;t like the way something is done? Change it!
      </>
    ),
  },
  {
    title: "Lightweight",
    Svg: require("@site/static/img/void-unop.svg").default,
    description: (
      <>
        void is very lightweight, and doesn't come with a lot of bloat. This
        makes it perfect for small projects or large ones.
      </>
    ),
  },
  {
    title: "Powered by Webpack",
    Svg: require("@site/static/img/void-webpack.svg").default,
    description: (
      <>
        void is powered by webpack, which means you can use all of the features
        that webpack has to offer. This includes hot module reloading, tree
        shaking, and more.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
