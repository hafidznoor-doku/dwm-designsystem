import type { Meta, StoryObj } from "@storybook/react-vite";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Avatar } from "./Avatar";
import { avatarExport, avatarScene, fromElyx } from "./Avatar.elyx";

const meta = {
  title: "Controls/Avatar",
  component: Avatar,
  args: { gender: "male", size: 38 },
  argTypes: {
    gender: { control: "inline-radio", options: ["male", "female"] },
    size: { control: { type: "number", min: 24, max: 96, step: 2 } },
    src: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "User profile picture in a 38 dp rounded square (`radius-md`). Pass `src` for the user's photo (cropped to cover); without it, " +
          "`gender` picks the default illustration. Give it `alt` only when the name isn't shown next to it.\n\n" +
          "**Design notes:** the two placeholders are built differently: *male* is a bitmap scaled to 41 dp and offset by −1 dp inside the frame, " +
          "while *female* is a 38 dp vector illustration with its own red rounded background.",
      },
    },
    elyxSpec: (args: Parameters<typeof Avatar>[0]) => ({ file: avatarScene.file, scene: avatarExport(args), live: <Avatar {...args} /> }),
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placeholders: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Avatar gender="male" />
      <Avatar gender="female" />
      <Avatar gender="female" size={56} />
    </div>
  ),
};

export const AllVariants: Story = matrixStory(avatarScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(avatarScene, fromElyx) as Story;
