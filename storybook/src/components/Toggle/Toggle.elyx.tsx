// Links <Toggle> and <ToggleListItem> to controls/toggle.elyx.
import scene from "../../generated/scenes/controls/toggle.json";
import { iconOf, instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, textOf } from "../../elyx/Scene";
import { exportOf, findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { Toggle, ToggleListItem } from "./Toggle";

export const toggleScene = scene as unknown as SceneFile;

/** The Elyx export that specifies these props. */
export const toggleExport = (p: { checked?: boolean; defaultChecked?: boolean; disabled?: boolean }) =>
  findVariant(toggleScene, "Toggle", { active: String(!!(p.checked ?? p.defaultChecked)), disabled: String(!!p.disabled) })!;

export const toggleListExport = () => exportOf(toggleScene, "toggleList");

/** A toggle instance's on/off state, read from its track color (instances carry no variant props). */
const isOn = (node: SceneNode) => /red/.test(findNode(node, "container")?.spec.fills?.[0]?.token ?? "");
const isDisabled = (node: SceneNode) => findNode(node, "trigger")?.spec.fills?.[0]?.token !== "colors.neutral-00";

export const fromElyx: FromElyx = (node, _v, exp) => {
  if (exp.set === "_toggle-list") {
    const toggle = node.c?.find((c) => c.inst?.file === "controls/toggle.elyx") ?? findNode(node, "toggle")!;
    return (
      <ToggleListItem
        key={exp.ref}
        label={textOf(node, "ubahProfil") ?? ""}
        icon={iconOf(node, "dwIcon")}
        defaultChecked={isOn(toggle)}
        disabled={isDisabled(toggle)}
        style={{ width: node.spec.w }}
      />
    );
  }
  // State comes from the node's colors so screen-level overrides carry over.
  // Uncontrolled, so toggles in generated screens can still be flipped.
  return <Toggle key={exp.ref} defaultChecked={isOn(node)} disabled={isDisabled(node)} aria-label={node.n} style={{ width: node.spec.w }} />;
};

export const elyxInstances = instancesFor(toggleScene, fromElyx);
