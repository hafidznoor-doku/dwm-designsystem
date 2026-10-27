import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { PillTabs } from "./PillTabs";
import { fromElyx, pillTabsExport, pillTabsScene } from "./PillTabs.elyx";

const meta = {
  title: "Controls/PillTabs",
  component: PillTabs,
  args: { options: ["Semua", "Masuk", "Keluar"], size: "medium", "aria-label": "Riwayat" },
  argTypes: {
    size: { control: "inline-radio", options: ["medium", "large"] },
    value: { control: "text", description: "Controlled selection. Leave unset for an uncontrolled group." },
    defaultValue: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Pill-shaped tabs that switch the content below them (2–5 tabs). Single selection with `role=\"tablist\"`; click or ←/→ moves the selection. " +
          "`options` takes plain labels or `{ value, label, icon, disabled }`. Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`, else the first tab).\n\n" +
          "**Design notes:** the Figma set only varies the tab count (2–5), always Medium (28 dp) pills with 16 dp gaps and the first tab selected. " +
          "The tab icon layer exists but is hidden in every variant.",
      },
    },
    elyxSpec: (args: Parameters<typeof PillTabs>[0]) => ({ file: pillTabsScene.file, scene: pillTabsExport(args), live: <PillTabs {...args} /> }),
  },
} satisfies Meta<typeof PillTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: function Render(args) {
    const [tab, setTab] = useState("masuk");
    const options = [
      { value: "semua", label: "Semua" },
      { value: "masuk", label: "Masuk" },
      { value: "keluar", label: "Keluar" },
      { value: "pending", label: "Pending", disabled: true },
    ];
    return (
      <div style={{ display: "grid", gap: 12, fontFamily: "var(--doku-font-brand)" }}>
        <PillTabs {...args} options={options} value={tab} onChange={setTab} />
        <span>Tab aktif: {tab}</span>
      </div>
    );
  },
};

export const WithIcons: Story = {
  args: { options: [{ value: "qris", label: "QRIS", icon: "pan-tool-outlined" }, { value: "kartu", label: "Kartu", icon: "payment-outlined" }] },
};

export const AllVariants: Story = matrixStory(pillTabsScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(pillTabsScene, fromElyx) as Story;
