import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.tsx", "../src/components/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
  staticDirs: ["../public", { from: "../../resources", to: "/resources" }],
  framework: { name: "@storybook/react-vite", options: {} },
  core: { disableTelemetry: true },
  typescript: { reactDocgen: "react-docgen" },
};

export default config;
