import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Keyboard, type KeyboardKey } from "../Keyboard/Keyboard";
import { Pin, PinDots } from "./Pin";
import { fromElyx, pinExport, pinScene } from "./Pin.elyx";

const DEMO_PIN = "123456";

const meta = {
  title: "Controls/PIN",
  component: Pin,
  args: { mode: "authentication", value: "", error: "", showBiometric: true },
  argTypes: {
    mode: { control: "inline-radio", options: ["authentication", "transactional"] },
    value: { control: "text", description: "Entered digits (controls the dots)." },
    error: { control: "text" },
    onChange: { action: "onChange" },
    onComplete: { action: "onComplete" },
    onForgot: { action: "onForgot" },
    onBack: { action: "onBack" },
    onBiometric: { action: "onBiometric" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "PIN entry on brand red: header, six dots, optional error, *LUPA PIN?* and the PIN keypad (Controls/Keyboard, `tone=\"brand\"`). " +
          "`authentication` is the login screen (greeting, 16 dp dots); `transactional` confirms a payment (back button, 20 dp dots, full 360 × 755 screen). " +
          "Use it controlled (`value` + `onChange`) or uncontrolled (`defaultValue`); `onComplete` fires when the last digit is entered. " +
          "`PinDots` is exported on its own for custom layouts.\n\n" +
          "**Design notes:** the Figma set is named by state (`default` / `filled` / `error`), not by fill count; only empty and all-filled dots are drawn, partial fills are implied. " +
          "Authentication dots are one 216 dp SVG while transactional dots are six 20 dp frames. " +
          "The keypad sits 9 dp from the left in `transactional default/filled` and 8 dp in `transactional error`; the coded screen centres it (8.5 dp). " +
          "On error the dots go back to empty, so the error variant also clears the value.",
      },
    },
    elyxSpec: (args: Parameters<typeof Pin>[0]) => ({ file: pinScene.file, scene: pinExport(args), live: <Pin {...args} /> }),
  },
} satisfies Meta<typeof Pin>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled by the `value` / `error` controls; the keypad still types. */
export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? "");
    const [shown, setShown] = useState(args.value);
    if (shown !== args.value) { setShown(args.value); setValue(args.value ?? ""); }
    return <Pin {...args} value={value} onChange={(v) => { setValue(v); args.onChange?.(v); }} error={value ? undefined : args.error || undefined} />;
  },
};

/** Type 123456 to succeed; any other PIN shows the error and clears the dots. */
export const LoginFlow: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string>();
    const [ok, setOk] = useState(false);
    return (
      <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <Pin
          {...args}
          value={value}
          error={error}
          onChange={(v) => { setValue(v); setError(undefined); setOk(false); }}
          onComplete={(v) => {
            if (v === DEMO_PIN) setOk(true);
            else { setError("PIN salah. Silakan coba lagi"); setValue(""); }
          }}
        />
        <small>{ok ? "PIN benar ✓" : `Coba ${DEMO_PIN}`}</small>
      </div>
    );
  },
  parameters: { controls: { include: ["mode"] } },
};

export const Transactional: Story = { args: { mode: "transactional", value: "123" } };

export const Error: Story = { args: { error: "PIN salah. Silakan coba lagi" } };

/** `PinDots` wired to a standalone light `Keyboard`: the keypad's `onKey` drives the dots. */
export const DotsWithKeyboard: Story = {
  name: "PIN dots + Keyboard",
  render: function Render() {
    const [pin, setPin] = useState("");
    const onKey = (k: KeyboardKey) =>
      setPin((p) => (k === "backspace" ? p.slice(0, -1) : /^\d$/.test(k) && p.length < 6 ? p + k : p));
    return (
      <div style={{ width: 343, display: "grid", gap: 24 }}>
        <div style={{ background: "var(--elyx-colors-red-50)", padding: "24px 0", borderRadius: 12 }}>
          <PinDots filled={pin.length} />
        </div>
        <Keyboard layout="pin" tone="light" showBiometric={false} onKey={onKey} />
        <small style={{ textAlign: "center" }}>{pin.length === 6 ? "PIN lengkap" : `${pin.length} / 6`}</small>
      </div>
    );
  },
  parameters: { controls: { disable: true }, elyxSpec: undefined },
};

export const AllVariants: Story = matrixStory(pinScene, fromElyx) as Story;

export const ElyxVariant: Story = elyxVariantStory(pinScene, fromElyx) as Story;
