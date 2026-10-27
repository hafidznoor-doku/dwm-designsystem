import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Pill } from "./Pill";
import { fromElyx, pillExport, pillScene, pillSwitchExport } from "./Pill.elyx";
import { PillSwitch } from "./PillSwitch";

const switchOptions = [
  { value: "scan", label: "QRIS", icon: "pan-tool-outlined" },
  { value: "card", label: "Kartu", icon: "payment-outlined" },
];

const meta = {
  title: "Controls/Pill",
  component: Pill,
  args: { label: "QRIS", icon: "payment-outlined", size: "medium", appearance: "pill", selected: false, disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["large", "medium"] },
    appearance: { control: "inline-radio", options: ["pill", "filter"] },
    icon: { control: "select", options: [undefined, "payment-outlined", "pan-tool-outlined"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Selectable chip, the building block of `PillTabs` (`appearance=\"pill\"`, red when selected) and `Filter` (`appearance=\"filter\"`, grey when selected). " +
          "On its own it is a toggle button with `aria-pressed`; inside those groups it gets tab / radio roles. " +
          "`PillSwitch` (Figma `switch`) is the compact two-way mode switch from the same page.\n\n" +
          "**Design notes:**\n" +
          "- Size names don't line up between sets: `_pill` is 32 (Large) / 28 (Medium), `_filter-pill` is 40 (Large) / 32 (Medium), so a Medium filter pill is as tall as a Large tab pill.\n" +
          "- Filter pills use an off-palette grey, rgb(204 204 204), for unselected text and icons.\n" +
          "- `_filter-pill` has no disabled state; the coded one greys the text with `neutral-30` like `_pill`.\n" +
          "- In `switch`, the selected segment has a 10 dp gap between icon and label, the unselected one 4 dp, so segments change width when selected.",
      },
    },
    elyxSpec: (args: Parameters<typeof Pill>[0]) => ({ file: pillScene.file, scene: pillExport(args), live: <Pill {...args} /> }),
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(args.selected);
    return <Pill {...args} selected={on} onClick={() => setOn(!on)} />;
  },
};

export const Filter: Story = { args: { appearance: "filter", size: "large", selected: true, icon: undefined, label: "Semua" } };

export const Switch: Story = {
  render: () => <PillSwitch options={switchOptions} defaultValue="scan" aria-label="Metode bayar" />,
  parameters: { elyxSpec: () => ({ file: pillScene.file, scene: pillSwitchExport(), live: <PillSwitch options={switchOptions} defaultValue="scan" /> }) },
};

export const AllVariants: Story = matrixStory(pillScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(pillScene, fromElyx) as Story;
