import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorsPage, IconsPage, PlatformTokensPage, SpacingPage, TypographyPage } from "../../src/docs/Foundations";

const meta: Meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded", controls: { disable: true }, backgrounds: { value: "white" } },
};
export default meta;
type Story = StoryObj;

export const Colors: Story = { render: () => <ColorsPage /> };
export const Typography: Story = { render: () => <TypographyPage /> };
export const SpacingAndRadius: Story = { name: "Spacing & radius", render: () => <SpacingPage /> };
export const Icons: Story = { render: () => <IconsPage /> };
export const PlatformTokens: Story = { name: "Platform tokens (Android / iOS)", render: () => <PlatformTokensPage /> };
