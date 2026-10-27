// Links <Checkbox> to controls/checkbox.elyx.
import scene from "../../generated/scenes/controls/checkbox.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { isShown, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Checkbox, type CheckboxProps } from "./Checkbox";

export const checkboxScene = scene as unknown as SceneFile;

const STATES: Record<string, { checked: boolean; disabled: boolean }> = {
  Default: { checked: false, disabled: false },
  Checked: { checked: true, disabled: false },
  "Disabled default": { checked: false, disabled: true },
  "Disabled checked": { checked: true, disabled: true },
};

/** The Elyx export that specifies these props. */
export const checkboxExport = (p: Pick<CheckboxProps, "checked" | "defaultChecked" | "disabled">) => {
  const checked = !!(p.checked ?? p.defaultChecked);
  const state = Object.entries(STATES).find(([, s]) => s.checked === checked && s.disabled === !!p.disabled)![0];
  return findVariant(checkboxScene, "Checkbox", { state })!;
};

export const fromElyx: FromElyx = (node, v, exp) => {
  const s = STATES[v.state] ?? STATES.Default;
  return (
    <Checkbox
      key={exp.ref}
      title={isShown(node, "title") ? textOf(node, "title") : undefined}
      subtitle={isShown(node, "subHeading") ? textOf(node, "subHeading") : undefined}
      defaultChecked={s.checked}
      disabled={s.disabled}
      style={node.spec.wMode === "fill" ? { width: "100%" } : { width: node.spec.w }}
    />
  );
};

export const elyxInstances = instancesFor(checkboxScene, fromElyx);
