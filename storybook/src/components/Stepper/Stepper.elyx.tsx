// Links <Stepper> to controls/stepper.elyx.
import scene from "../../generated/scenes/controls/stepper.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Stepper, type StepperProps } from "./Stepper";

export const stepperScene = scene as unknown as SceneFile;

/** The Elyx export for these props (the design only has 3-step variants). */
export const stepperExport = (p: Pick<StepperProps, "current">) =>
  findVariant(stepperScene, "Stepper Horizontal", { "Count step": `Step ${Math.min(Math.max(p.current, 1), 3)}` })!;

export const fromElyx: FromElyx = (node, v) => {
  const track = findNode(node, "progressIndicator4");
  const total = (track?.c ?? []).filter((c) => !c.hidden).length || 3;
  const current = Number(/\d+/.exec(v["Count step"] ?? "")?.[0] ?? 1);
  return (
    <Stepper
      current={current}
      total={total}
      label={textOf(node, "steps")}
      subtitle={textOf(node, "subtitle")}
      style={{ width: node.spec.w }}
    />
  );
};

export const elyxInstances = instancesFor(stepperScene, fromElyx);
