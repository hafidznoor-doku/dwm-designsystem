import type { Meta, StoryObj } from "@storybook/react-vite";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Badge } from "./Badge";
import { badgeExport, badgeScene, fromElyx } from "./Badge.elyx";

const meta = {
  title: "Controls/Badge",
  component: Badge,
  args: { status: "verified" },
  argTypes: {
    status: { control: "inline-radio", options: ["unverified", "pending", "verified"] },
    label: { control: "text" },
    iconStart: { control: "select", options: [undefined, null, "verified-round", "hourglass-bottom-outlined", "account-circle-round"] },
    iconEnd: { control: "select", options: [undefined, null, "add-round", "chevron-right", "mode-edit-round"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Account level (KYC) badge next to the user's name: `unverified` (Basic, with a plus to upgrade), `pending` (Verifikasi Diproses, with a chevron), " +
          "and `verified` (Premium). `status` sets color, label and icons; override `label` / `iconStart` / `iconEnd` as needed (`null` hides a default icon). " +
          "Pass `onClick` to render it as a button.\n\n" +
          "**Design notes:**\n" +
          "- The badge is set in **Inter Semi Bold 12**, while the rest of the library uses DIN Next.\n" +
          "- *Pending* uses `red-05` (a pale pink) for the text and hourglass on `yellow-60`, and `neutral-background` for the chevron, instead of white.\n" +
          "- The *Basic* plus icon is an off-palette near-white, rgb(252 252 253).\n" +
          "- *belum-verifikasi* is built as an instance of *sudah-verifikasi* with overrides, not as its own layer tree.\n" +
          "- Each badge has a 1 px border in the same color as its fill, so it is invisible and not drawn here.",
      },
    },
    elyxSpec: (args: Parameters<typeof Badge>[0]) => ({ file: badgeScene.file, scene: badgeExport(args), live: <Badge {...args} /> }),
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Badge status="unverified" />
      <Badge status="pending" />
      <Badge status="verified" />
    </div>
  ),
};

export const Clickable: Story = { args: { status: "unverified", onClick: () => {} } };

export const AllVariants: Story = matrixStory(badgeScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(badgeScene, fromElyx) as Story;
