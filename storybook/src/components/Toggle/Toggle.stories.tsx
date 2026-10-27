import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Toggle, ToggleListItem } from "./Toggle";
import { fromElyx, toggleExport, toggleListExport, toggleScene } from "./Toggle.elyx";

const meta = {
  title: "Controls/Toggle",
  component: Toggle,
  args: { defaultChecked: false, disabled: false, "aria-label": "Smart Login" },
  argTypes: {
    checked: { control: "boolean", description: "Controlled value. Leave unset for an uncontrolled toggle." },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "On/off switch for settings that take effect immediately (e.g. Smart Login). It is a native checkbox with `role=\"switch\"`: " +
          "click or Space toggles it, and it works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`). " +
          "Use `ToggleListItem` for a settings row; the whole row is the label.\n\n" +
          "**Design notes:** the switch is 37.78 × 20 dp in the component, but instances in `blocks/account` are resized to 38 × 20. " +
          "The thumb shadow flips direction between off (3, 3) and on (−4, 3), and disabled toggles have no shadow. " +
          "The `_toggle-list` label and icon use an off-palette grey, rgb(77 77 77), instead of a neutral token.",
      },
    },
    elyxSpec: (args: Parameters<typeof Toggle>[0]) => ({ file: toggleScene.file, scene: toggleExport(args), live: <Toggle {...args} /> }),
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Toggle disabled aria-label="Nonaktif" />
      <Toggle disabled defaultChecked aria-label="Nonaktif aktif" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [on, setOn] = useState(true);
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "var(--doku-font-brand)" }}>
        <Toggle checked={on} onChange={setOn} aria-label="Notifikasi" />
        <span>Notifikasi {on ? "aktif" : "nonaktif"}</span>
      </div>
    );
  },
};

export const ListItem: Story = {
  name: "Toggle list item",
  render: () => <ToggleListItem label="Smart Login" icon="dw-icon-akun-smart-login-outline" defaultChecked style={{ width: 344 }} />,
  parameters: { elyxSpec: () => ({ file: toggleScene.file, scene: toggleListExport(), live: <ToggleListItem label="Smart Login" icon="dw-icon-akun-smart-login-outline" defaultChecked style={{ width: 344 }} /> }) },
};

export const AllVariants: Story = matrixStory(toggleScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(toggleScene, fromElyx) as Story;
