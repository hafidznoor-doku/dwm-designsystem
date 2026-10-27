import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Filter } from "./Filter";
import { filterExport, filterScene, fromElyx } from "./Filter.elyx";

const meta = {
  title: "Controls/Filter",
  component: Filter,
  args: { options: ["Semua", "Top Up", "Transfer", "Pembayaran", "Tarik Tunai", "Refund"], size: "large", "aria-label": "Filter transaksi" },
  argTypes: {
    size: { control: "inline-radio", options: ["large", "medium"] },
    value: { control: "text", description: "Controlled selection. Leave unset for an uncontrolled filter." },
    defaultValue: { control: "text" },
  },
  decorators: [(S) => <div style={{ width: 360, background: "var(--elyx-colors-neutral-00)", padding: "12px 0" }}><S /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Screen-wide row of filter pills with 16 dp side insets; pills past the edge scroll horizontally. Single choice (`role=\"radiogroup\"`, ←/→ move the selection). " +
          "`options` takes plain labels or `{ value, label, icon, disabled }`. `large` pills are 40 dp, `medium` 32 dp.\n\n" +
          "**Design notes:** the Figma frame is 390 dp wide with six 58 dp pills, so the last ~1.5 pills overflow to 444 dp; Elyx draws the overflow unclipped, " +
          "while the coded row scrolls (clips at its width), which is how it behaves on a phone. The visual check therefore compares a 390 dp box against a 444 dp render " +
          "and reports a large diff on both exports. Large pills are fully round (radius 32); Medium ones use radius 16.",
      },
    },
    elyxSpec: (args: Parameters<typeof Filter>[0]) => ({ file: filterScene.file, scene: filterExport(args), live: <Filter {...args} /> }),
  },
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Medium: Story = { args: { size: "medium" } };

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("Transfer");
    return (
      <div style={{ display: "grid", gap: 12, fontFamily: "var(--doku-font-brand)" }}>
        <Filter {...args} value={value} onChange={setValue} />
        <span style={{ padding: "0 16px" }}>Filter: {value}</span>
      </div>
    );
  },
};

export const AllVariants: Story = matrixStory(filterScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(filterScene, fromElyx) as Story;
