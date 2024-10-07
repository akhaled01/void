import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "DOM",
      items: [
        {
          type: "category",
          label: "createElement",
          items: [
            "DOM/createElement/functions/createElement",
            "DOM/createElement/README",
          ],
        },
        {
          type: "category",
          label: "render",
          items: ["DOM/render/functions/render", "DOM/render/README"],
        },
        {
          type: "category",
          label: "types",
          items: [
            "DOM/types/README",
            {
              type: "category",
              label: "type-aliases",
              items: [
                "DOM/types/type-aliases/ElementVNode",
                "DOM/types/type-aliases/TextVNode",
                "DOM/types/type-aliases/VNode",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "pulse",
      items: [
        "pulse/classes/Pulse",
        "pulse/functions/genPulse",
        "pulse/README",
        "pulse/variables/pulseRegistry",
      ],
    },
    {
      type: "category",
      label: "router",
      items: ["router/classes/Router", "router/README"],
    },
    {
      type: "category",
      label: "signal",
      items: [
        "signal/classes/Signal",
        "signal/README",
        "signal/type-aliases/DocumentEventNames",
      ],
    },
    {
      type: "category",
      label: "types",
      items: [
        {
          type: "category",
          label: "assets",
          items: [
            "types/assets/README",
            {
              type: "category",
              label: "namespaces",
              items: [
                {
                  type: "category",
                  label: "*.gif",
                  items: [
                    "types/assets/namespaces/*.gif/README",
                    "types/assets/namespaces/*.gif/variables/default",
                  ],
                },
                {
                  type: "category",
                  label: "*.jpeg",
                  items: [
                    "types/assets/namespaces/*.jpeg/README",
                    "types/assets/namespaces/*.jpeg/variables/default",
                  ],
                },
                {
                  type: "category",
                  label: "*.jpg",
                  items: [
                    "types/assets/namespaces/*.jpg/README",
                    "types/assets/namespaces/*.jpg/variables/default",
                  ],
                },
                {
                  type: "category",
                  label: "*.png",
                  items: [
                    "types/assets/namespaces/*.png/README",
                    "types/assets/namespaces/*.png/variables/default",
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "jsx",
          items: [
            {
              type: "category",
              label: "interfaces",
              items: [
                "types/jsx/interfaces/AnchorProps",
                "types/jsx/interfaces/ButtonProps",
                "types/jsx/interfaces/CommonProps",
                "types/jsx/interfaces/ImageProps",
              ],
            },
            {
              type: "category",
              label: "namespaces",
              items: [
                {
                  type: "category",
                  label: "JSX",
                  items: [
                    "types/jsx/namespaces/JSX/interfaces/Element",
                    "types/jsx/namespaces/JSX/interfaces/IntrinsicElements",
                    "types/jsx/namespaces/JSX/README",
                  ],
                },
              ],
            },
            "types/jsx/README",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
