import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { Button } from "../Button/Button";
import { Stepper } from "./Stepper";
import { fromElyx, stepperExport, stepperScene } from "./Stepper.elyx";

const frame = (S: () => React.ReactNode) => <div style={{ width: 360 }}><S /></div>;

const meta = {
  title: "Controls/Stepper",
  component: Stepper,
  args: { current: 1, total: 3, subtitle: "Buat PIN Kamu" },
  argTypes: {
    current: { control: { type: "range", min: 0, max: 6, step: 1 } },
    total: { control: { type: "range", min: 2, max: 6, step: 1 } },
  },
  decorators: [frame],
  parameters: {
    docs: {
      description: {
        component:
          "Shows progress through a multi-step form (registration, PIN creation). Put it at the top of the screen under the app bar; " +
          "`subtitle` names what the user does on the current step. Segments split the width evenly, so any `total` works.\n\n" +
          "**Design notes:** in `Count step=Step 3` the second and third segments use `red-50` while the first uses `red-60` " +
          "(Steps 1 and 2 use `red-60` throughout); the coded stepper uses `red-60` for every completed segment. " +
          "The empty segment (#EAECF0) and subtitle (#4D4D4D) colors are off-palette. " +
          "A hidden `currentStep` title (Bold 24) sits in the Figma layer but is never shown.",
      },
    },
    elyxSpec: (args: Parameters<typeof Stepper>[0]) => ({ file: stepperScene.file, scene: stepperExport(args), live: <Stepper {...args} /> }),
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FourSteps: Story = { args: { current: 2, total: 4, subtitle: "Verifikasi Identitas" } };

export const Interactive: Story = {
  render: (args) => {
    const [step, setStep] = useState(1);
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <Stepper {...args} current={step} />
        <div style={{ display: "flex", gap: 8, padding: "0 16px" }}>
          <Button size="small" variant="neutral" label="Kembali" disabled={step <= 1} onClick={() => setStep((s) => s - 1)} />
          <Button size="small" label="Lanjut" disabled={step >= (args.total ?? 3)} onClick={() => setStep((s) => s + 1)} />
        </div>
      </div>
    );
  },
};

export const AllVariants: Story = { ...(matrixStory(stepperScene, fromElyx) as Story), decorators: [] };

export const ElyxVariant: Story = { ...(elyxVariantStory(stepperScene, fromElyx) as Story), decorators: [] };
