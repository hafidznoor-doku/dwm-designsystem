import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Keyboard, KeyboardItem, type KeyboardKey } from "./Keyboard";
import { fromElyx, keyboardExport, keyboardScene } from "./Keyboard.elyx";

/** Shows what the keypad typed, so the stories prove that keys emit `onKey`. */
function Typed(props: Parameters<typeof Keyboard>[0]) {
  const [value, setValue] = useState("");
  const onKey = (k: KeyboardKey) => {
    props.onKey?.(k);
    setValue((v) => (k === "backspace" ? v.slice(0, -1) : /^[0-9.,-]$/.test(k) ? v + k : k === "space" ? v + " " : v));
  };
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <output style={{ font: "500 20px var(--doku-font-brand)", minHeight: 28 }}>{value || "—"}</output>
      <Keyboard {...props} onKey={onKey} />
    </div>
  );
}

const meta = {
  title: "Controls/Keyboard",
  component: Keyboard,
  args: { layout: "pin", tone: "light", showBiometric: false, systemBar: true, disabled: false },
  argTypes: {
    layout: { control: "inline-radio", options: ["pin", "android", "ios"] },
    tone: { control: "inline-radio", options: ["light", "brand"], if: { arg: "layout", eq: "pin" } },
    onKey: { action: "onKey" },
  },
  render: (args) => <Typed {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          "Numeric keypad. Every key is a `<button>` that calls `onKey(key)` with `\"0\"`–`\"9\"`, `\"backspace\"`, `\"biometric\"` and, on the native mock-ups, `\",\" \".\" \"-\" \"space\" \"done\"`. " +
          "Use `layout=\"pin\"` for PIN entry (with `tone=\"brand\"` on the red PIN screen, see Controls/PIN); `android` and `ios` only mock the OS keyboard for screen ideation — real apps get those from the platform.\n\n" +
          "`KeyboardItem` is the 52 dp calculator key (`_keyboard-item`), `KeyboardOperationIcon` the 28 dp backspace glyph (`_keyboard-icon-operation`).\n\n" +
          "**Design notes:** the light `input PIN` keypad carries a Face ID icon tinted `neutral-00` on a white key, so it is invisible; `showBiometric` makes it explicit. " +
          "PIN keypad digits use off-palette #333333 and the backspace glyph #4D4D4D. No pressed state is drawn for the PIN keypad (a one-step darker key is used). " +
          "`_keyboard-item` has two `pressed=true, number` variants (20 px / 28 line and 22 px / auto line). " +
          "The iOS mock-up overflows its 291 dp frame by ~12 dp (the native layer is 302.6 dp), which offsets its visual check.",
      },
    },
    elyxSpec: (args: Parameters<typeof Keyboard>[0]) => ({ file: keyboardScene.file, scene: keyboardExport(args), live: <Keyboard {...args} /> }),
  },
} satisfies Meta<typeof Keyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PinBrand: Story = {
  args: { tone: "brand", showBiometric: true },
  decorators: [(S) => <div style={{ background: "var(--elyx-colors-red-50)", color: "var(--elyx-colors-neutral-00)", padding: 16 }}><S /></div>],
};

export const Android: Story = { args: { layout: "android" } };

export const IOS: Story = { name: "iOS", args: { layout: "ios" } };

export const CalculatorKeys: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 52px)", gap: 8 }}>
      {["7", "8", "9"].map((d) => <KeyboardItem key={d} label={d} />)}
      <KeyboardItem variant="operator" aria-label="Bagi" />
      {["4", "5", "6"].map((d) => <KeyboardItem key={d} label={d} />)}
      <KeyboardItem variant="operator" pressed aria-label="Bagi" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const AllVariants: Story = matrixStory(keyboardScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(keyboardScene, fromElyx) as Story;
