// Links <Radio> and <RadioIndicator> to controls/radio.elyx.
import scene from "../../generated/scenes/controls/radio.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { isShown, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Radio, RadioIndicator, type RadioProps } from "./Radio";

export const radioScene = scene as unknown as SceneFile;

/** Figma `:state` → props. */
const STATES: Record<string, { checked: boolean; disabled: boolean }> = {
  default: { checked: false, disabled: false },
  checked: { checked: true, disabled: false },
  "disabled checked": { checked: true, disabled: true },
  "disabled unchecked": { checked: false, disabled: true },
};

/** The Elyx export that specifies these props. */
export const radioExport = (p: Pick<RadioProps, "checked" | "defaultChecked" | "disabled" | "size">) => {
  const checked = !!(p.checked ?? p.defaultChecked);
  const state = Object.entries(STATES).find(([, s]) => s.checked === checked && s.disabled === !!p.disabled)![0];
  return findVariant(radioScene, "Radio Button", { state, Size: p.size ?? "large" })!;
};

export const fromElyx: FromElyx = (node, v, exp) => {
  if (exp.set === "_master_checkbox") {
    return (
      <RadioIndicator
        size={v.Size === "small" ? "small" : "medium"}
        checked={v.selected === "true"}
        disabled={v.active === "false"}
      />
    );
  }
  const s = STATES[v.state] ?? STATES.default;
  // Label and sub text are both called textLayer/subText; the label is the first text.
  const label = node.c?.find((c) => c.n === "textLayer")?.c?.find((c) => c.n === "textLayer" && !c.hidden)?.text?.content;
  return (
    <Radio
      key={exp.ref}
      size={v.Size === "small" ? "small" : "large"}
      label={label}
      subtitle={isShown(node, "subText") ? textOf(node, "subText") : undefined}
      defaultChecked={s.checked}
      disabled={s.disabled}
      style={node.spec.wMode === "fixed" ? { width: node.spec.w } : undefined}
    />
  );
};

export const elyxInstances = instancesFor(radioScene, fromElyx);
