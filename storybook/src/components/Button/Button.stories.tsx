import type { Meta, StoryObj } from "@storybook/react-vite";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Button } from "./Button";
import { buttonExport, buttonScene, fromElyx } from "./Button.elyx";

const meta = {
  title: "Controls/Button",
  component: Button,
  args: { label: "Bayar", size: "default", variant: "primary", state: "default", disabled: false, fullWidth: false },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "small"] },
    variant: { control: "select", options: ["primary", "secondary", "textPrimary", "neutral", "textNeutral"] },
    state: { control: "inline-radio", options: ["default", "pressed", "disabled"] },
    iconStart: { control: "select", options: [undefined, "icon-add", "arrow-back", "arrow-forward-ios-outlined"] },
    iconEnd: { control: "select", options: [undefined, "ads-click-outlined", "arrow-forward-ios-outlined"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Primary actions use `primary`; one per screen. `secondary` and `neutral` for alternatives, text variants for low-emphasis actions. " +
          "Pressed state comes from touch-down (`:active` here); `state` only forces it for documentation.\n\n" +
          "**Design note:** primary and secondary hug to 40 / 30 dp, while neutral and text variants are fixed at 42 / 32 dp in the Figma source. Confirm with design before normalizing.",
      },
    },
    elyxSpec: (args: Parameters<typeof Button>[0]) => ({ file: buttonScene.file, scene: buttonExport(args), live: <Button {...args} /> }),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = { args: { iconStart: "icon-add", iconEnd: "arrow-forward-ios-outlined" } };

export const FullWidth: Story = { args: { label: "Lanjutkan", fullWidth: true }, decorators: [(S) => <div style={{ width: 328 }}><S /></div>] };

export const AllVariants: Story = matrixStory(buttonScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(buttonScene, fromElyx) as Story;
