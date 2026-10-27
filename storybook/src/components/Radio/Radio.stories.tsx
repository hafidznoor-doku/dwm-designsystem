import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Radio, RadioIndicator } from "./Radio";
import { fromElyx, radioExport, radioScene } from "./Radio.elyx";

const meta = {
  title: "Controls/Radio",
  component: Radio,
  args: { label: "Laki-laki", subtitle: "Pilih jika laki laki", size: "large", name: "playground", value: "laki-laki", defaultChecked: false, disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["large", "small"] },
    checked: { control: "boolean", description: "Controlled value. Leave unset for an uncontrolled radio." },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Single choice from a short list. It is a native radio input: give options the same `name` and the browser handles single selection and arrow keys, " +
          "or control it with `checked` + `onChange` (which receives the option's `value`). " +
          "`RadioIndicator` is the bare circle (Figma `_master_checkbox`) for rows that handle selection themselves.\n\n" +
          "**Design notes:**\n" +
          "- *Radio Button large* uses its own 25 dp circle, while `_master_checkbox` large is 24 dp; small is 16 dp in both.\n" +
          "- The large *default* state sets its label in DIN Medium 16 (43 dp tall); every other state uses Regular 14 (40 dp). The coded radio uses Regular 14 throughout so the label doesn't change when selected.\n" +
          "- Small *default* and *checked* are fixed at 156.5 dp wide; small disabled ones hug at 126 dp.\n" +
          "- Disabled states keep the label in `neutral-80`; only the circle greys out.",
      },
    },
    elyxSpec: (args: Parameters<typeof Radio>[0]) => ({ file: radioScene.file, scene: radioExport(args), live: <Radio {...args} /> }),
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Group: Story = {
  render: function Render() {
    const [value, setValue] = useState("laki-laki");
    return (
      <div role="radiogroup" aria-label="Jenis kelamin" style={{ display: "grid", gap: 16 }}>
        <Radio name="gender" value="laki-laki" label="Laki-laki" subtitle="Pilih jika laki laki" checked={value === "laki-laki"} onChange={setValue} />
        <Radio name="gender" value="perempuan" label="Perempuan" subtitle="Pilih jika perempuan" checked={value === "perempuan"} onChange={setValue} />
        <Radio name="gender" value="lainnya" label="Tidak disebutkan" disabled />
      </div>
    );
  },
};

export const Small: Story = { args: { size: "small", defaultChecked: true } };

export const Indicator: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {(["large", "medium", "small"] as const).map((size) => (
        <div key={size} style={{ display: "flex", gap: 8 }}>
          <RadioIndicator size={size} />
          <RadioIndicator size={size} checked />
          <RadioIndicator size={size} checked disabled />
          <RadioIndicator size={size} disabled />
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = matrixStory(radioScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(radioScene, fromElyx) as Story;
