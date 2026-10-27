import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Checkbox } from "./Checkbox";
import { checkboxExport, checkboxScene, fromElyx } from "./Checkbox.elyx";

const meta = {
  title: "Controls/Checkbox",
  component: Checkbox,
  args: { title: "Saya setuju dengan Syarat & Ketentuan", subtitle: "Wajib dicentang untuk melanjutkan", defaultChecked: false, disabled: false },
  argTypes: {
    checked: { control: "boolean", description: "Controlled value. Leave unset for an uncontrolled checkbox." },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [(S) => <div style={{ width: 326 }}><S /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-select or consent option with a title and optional sub heading. It is a native checkbox, so clicking the text toggles it and Space works with focus. " +
          "Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).\n\n" +
          "**Design notes:**\n" +
          "- In the Elyx export the *Checked* box renders as an empty white square, and *Disabled checked* as a plain grey square: the two-tone Figma icon (box + check) was tinted with a single color, which hid the check mark. " +
          "The coded checkbox follows the intended design instead: a brand red (`red-50`) box with a white check, grey (`neutral-40`) when disabled. Expect the visual diff to show the box on those two exports.\n" +
          "- The *Default* state's title is set in Noto Sans 12/18 while every other state uses DIN Next 14/15.96, which makes Default 42 dp tall instead of 40. The coded checkbox uses DIN 14 for every state so the label doesn't jump when checked.",
      },
    },
    elyxSpec: (args: Parameters<typeof Checkbox>[0]) => ({ file: checkboxScene.file, scene: checkboxExport(args), live: <Checkbox {...args} /> }),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const TitleOnly: Story = { args: { subtitle: undefined, title: "Ingat saya" } };

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <Checkbox {...args} disabled />
      <Checkbox {...args} disabled defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [on, setOn] = useState(false);
    return <Checkbox {...args} checked={on} onChange={setOn} subtitle={on ? "Dicentang" : "Belum dicentang"} />;
  },
};

export const AllVariants: Story = matrixStory(checkboxScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(checkboxScene, fromElyx) as Story;
