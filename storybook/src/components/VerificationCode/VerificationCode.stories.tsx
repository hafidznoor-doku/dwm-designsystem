import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { VerificationCode, useCountdown, type VerificationChannel, type VerificationStatus } from "./VerificationCode";
import { fromElyx, verificationExport, verificationScene } from "./VerificationCode.elyx";
import { VerificationScreen } from "./VerificationScreen";

const DEMO_CODE = "123456";
const DESTINATION: Record<VerificationChannel, string> = { sms: "08123****898", whatsapp: "08123****898", email: "user@mail.com" };

const meta = {
  title: "Controls/VerificationCode",
  component: VerificationCode,
  args: { channel: "sms", destination: "08123****898", value: "", status: "default", countdown: 120, chancesLeft: 2 },
  argTypes: {
    channel: { control: "inline-radio", options: ["sms", "whatsapp", "email"] },
    status: { control: "inline-radio", options: ["default", "wrong", "expired"] },
    countdown: { control: { type: "number", min: 0, step: 1 } },
    chancesLeft: { control: { type: "number", min: 0, max: 3, step: 1 } },
    onChange: { action: "onChange" },
    onComplete: { action: "onComplete" },
    onResend: { action: "onResend" },
    onSwitchChannel: { action: "onSwitchChannel" },
    onContactSupport: { action: "onContactSupport" },
  },
  decorators: [(S) => <div style={{ width: 360, background: "var(--elyx-colors-neutral-00)", padding: "24px 0" }}><S /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "One-time code entry after a code was sent by SMS, WhatsApp or e-mail. The cells are one real `<input inputMode=\"numeric\" autocomplete=\"one-time-code\">` (Controls/InputForm `PinInput`), so typing, paste and SMS autofill all work; non-digits are dropped and each digit lands in its own cell. " +
          "`status=\"wrong\"` / `\"expired\"` turn the cells red and show the message; `countdown` (seconds, see `useCountdown`) shows *Kirim ulang dalam mm:ss* and, at 0, the *Kirim Ulang* action. " +
          "SMS and WhatsApp offer each other as fallback; e-mail offers *Hubungi Customer Care*. `VerificationChanceInfo` (`_verification-chance-info`) and `VerificationScreen` (`_template-verif-code`) are exported too.\n\n" +
          "**Design notes:** empty cells are 28 × 20 dp but filled ones 28 × 28 dp, so the row grows by 8 dp on the first digit. " +
          "Filled cells override the fill/border to off-palette #F0F0F0 / #ECECEC (rendered here with `neutral-10` / `neutral-20`). " +
          "The subtitle box (341 dp) is wider than its 328 dp column. *Kirim Ulang* is drawn in body colour, indistinguishable from the text around it. " +
          "Expired variants still say *Sisa 2 kesempatan* regardless of the wrong-attempt count. The template's keyboard is the Android mock-up stretched to 375 dp.",
      },
    },
    elyxSpec: (args: Parameters<typeof VerificationCode>[0]) => ({ file: verificationScene.file, scene: verificationExport(args), live: <VerificationCode {...args} /> }),
  },
} satisfies Meta<typeof VerificationCode>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing works; `value` / `status` controls reset it. */
export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? "");
    const [shown, setShown] = useState(args.value);
    if (shown !== args.value) { setShown(args.value); setValue(args.value ?? ""); }
    return <VerificationCode {...args} value={value} onChange={(v) => { setValue(v); args.onChange?.(v); }} />;
  },
};

/** Live flow: a running countdown, 3 attempts; 123456 is the right code. */
export const Flow: Story = {
  render: function Render(args) {
    const channel = args.channel ?? "sms";
    const [value, setValue] = useState("");
    const [status, setStatus] = useState<VerificationStatus>("default");
    const [chances, setChances] = useState(2);
    const [ok, setOk] = useState(false);
    const { left, restart } = useCountdown(30);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
        <VerificationCode
          channel={channel}
          destination={DESTINATION[channel]}
          value={value}
          status={left === 0 && status === "default" && !ok ? "expired" : status}
          countdown={left}
          chancesLeft={chances}
          autoFocus
          onChange={(v) => { setValue(v); setStatus("default"); setOk(false); }}
          onComplete={(v) => {
            if (v === DEMO_CODE) setOk(true);
            else { setStatus("wrong"); setChances((c) => Math.max(0, c - 1)); }
          }}
          onResend={() => { setValue(""); setStatus("default"); setChances((c) => Math.max(0, c - 1)); restart(); }}
        />
        <small>{ok ? "Kode benar ✓" : `Kode demo: ${DEMO_CODE}`}</small>
      </div>
    );
  },
  parameters: { controls: { include: ["channel"] } },
};

export const Wrong: Story = { args: { value: "111111", status: "wrong", chancesLeft: 1 } };

export const Expired: Story = { args: { channel: "whatsapp", value: "111111", status: "expired", countdown: 0 } };

export const Email: Story = { args: { channel: "email", destination: "user@mail.com" } };

/** `_template-verif-code`: the code block on a full screen; the mock keyboard types into it. */
export const Screen: Story = {
  render: function Render() {
    const [value, setValue] = useState("");
    return <VerificationScreen code={{ channel: "sms", destination: "08123****898", value, onChange: setValue }} />;
  },
  decorators: [],
  parameters: { controls: { disable: true }, elyxSpec: undefined },
};

export const AllVariants: Story = { ...(matrixStory(verificationScene, fromElyx) as Story), decorators: [] };

export const ElyxVariant: Story = { ...(elyxVariantStory(verificationScene, fromElyx) as Story), decorators: [] };
