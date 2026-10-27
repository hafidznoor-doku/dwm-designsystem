import type { Preview } from "@storybook/react-vite";
import { SpecSheet } from "../src/docs/SpecSheet";
import "../src/styles/base.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    backgrounds: {
      options: {
        canvas: { name: "Elyx canvas", value: "#F6F6F6" },
        white: { name: "White", value: "#FFFFFF" },
        dark: { name: "Dark", value: "#1A1A1A" },
      },
    },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Controls", "Blocks", "Screens"] },
    },
  },
  initialGlobals: { backgrounds: { value: "canvas" }, spec: "show" },
  globalTypes: {
    spec: {
      description: "Show the developer spec under each story",
      toolbar: {
        title: "Spec",
        icon: "ruler",
        items: [
          { value: "show", title: "Show spec" },
          { value: "hide", title: "Hide spec" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      // Stories set `parameters.elyxSpec(args)` to point at their Elyx export.
      const spec = ctx.viewMode === "story" && ctx.globals.spec !== "hide" ? ctx.parameters.elyxSpec?.(ctx.args) : null;
      return (
        <>
          <Story />
          {spec && <SpecSheet {...spec} />}
        </>
      );
    },
  ],
};

export default preview;
