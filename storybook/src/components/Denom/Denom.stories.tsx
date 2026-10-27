import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Denom, DenomOption, type DenomItem } from "./Denom";
import { channelItems, denomExport, denomOptionExport, denomScene, fromElyx } from "./Denom.elyx";

const walletItems: DenomItem[] = ["20.000", "50.000", "75.000", "100.000", "150.000", "200.000", "300.000", "500.000", "750.000"].map((value) => ({ value }));
const pulsaItems: DenomItem[] = [
  ["20.000", "21.500"], ["50.000", "51.500"], ["75.000", "76.000"], ["100.000", "101.500"],
  ["150.000", "151.500"], ["200.000", "201.500"], ["300.000", "301.500"], ["500.000", "501.500"],
].map(([value, price]) => ({ value, price: `Harga Rp ${price}` }));
const ITEMS = { wallet: walletItems, pulsa: pulsaItems, channel: channelItems };
const WIDTH = { wallet: 358, pulsa: 328, channel: 342 };

type Args = Parameters<typeof Denom>[0];
/** The preset item lists follow the `layout` control; custom `items` are kept. */
const itemsFor = (a: Args) => (Object.values(ITEMS).includes(a.items) ? ITEMS[a.layout ?? "wallet"] : a.items);

const meta = {
  title: "Controls/Denom",
  component: Denom,
  args: { layout: "wallet", value: "50.000", items: walletItems },
  argTypes: {
    layout: { control: "inline-radio", options: ["wallet", "pulsa", "channel"] },
    value: { control: "text" },
    items: { control: false },
    onChange: { action: "onChange" },
  },
  render: function Render(args: Args) {
    const layout = args.layout ?? "wallet";
    const [value, setValue] = useState(args.value);
    const [shown, setShown] = useState(args.value);
    if (shown !== args.value) { setShown(args.value); setValue(args.value); }
    return (
      <div style={{ width: WIDTH[layout] }}>
        <Denom {...args} items={itemsFor(args)} value={value} onChange={(v) => { setValue(v); args.onChange?.(v); }} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        component:
          "Single-choice grid for top-up amounts (`wallet`: 3 columns; `pulsa`: 2 columns with price) and payment channels (`channel`: 2 columns of logos). " +
          "It is a `radiogroup`; each `DenomOption` (`.denom-atom`) is a `radio` button, the chosen one gets a red-60 border. Columns share the container width.\n\n" +
          "**Design notes:** the bare `.denom-atom` uses an off-palette #CCCCCC border (channel: #EAECF0), but every placement in `Denom` overrides it to `neutral-30` (channel: `neutral-20`) and removes the white fill; the coded options keep the white fill. " +
          "Amount text is off-palette #4D4D4D. Only `nominal` has a `chosen` state; channel selection reuses it. " +
          "In `wallet navigation` the GoPay option is a flattened SVG of a whole option instead of an instance, and one logo is a bitmap cropped inside its frame.",
      },
    },
    elyxSpec: (args: Args) => ({ file: denomScene.file, scene: denomExport(args), live: <Denom {...args} items={itemsFor(args)} /> }),
  },
} satisfies Meta<typeof Denom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Pulsa: Story = { args: { layout: "pulsa", value: "100.000" } };

export const PaymentChannel: Story = { args: { layout: "channel", value: "OVO", label: "Pilih e-wallet" } };

export const Option: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <DenomOption label="15.000" price="Harga Rp 15.000" />
      <DenomOption label="15.000" price="Harga Rp 15.000" selected />
      <DenomOption variant="channel" logo="resources/assets/icons/emoney-gopay.svg" logoLabel="GoPay" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    elyxSpec: () => ({ file: denomScene.file, scene: denomOptionExport({ selected: true }), live: <DenomOption label="15.000" price="Harga Rp 15.000" selected /> }),
  },
};

export const AllVariants: Story = matrixStory(denomScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(denomScene, fromElyx) as Story;
