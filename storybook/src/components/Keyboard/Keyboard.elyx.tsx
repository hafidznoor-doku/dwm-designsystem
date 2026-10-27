// Links <Keyboard>, <KeyboardItem> and <KeyboardOperationIcon> to controls/keyboard.elyx.
import scene from "../../generated/scenes/controls/keyboard.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { Keyboard, KeyboardItem, KeyboardOperationIcon, type KeyboardProps } from "./Keyboard";

export const keyboardScene = scene as unknown as SceneFile;

/** The Elyx export for these Keyboard props. */
export const keyboardExport = (p: Pick<KeyboardProps, "layout">) =>
  findVariant(keyboardScene, "Keyboard Number", { "Property 1": p.layout === "pin" || !p.layout ? "input PIN" : p.layout })!;

/** Tone of a drawn PIN keypad (also used by the PIN control, which draws its own keypad). */
export const keypadTone = (keypad: SceneNode): KeyboardProps["tone"] =>
  findNode(keypad, "rectangle")?.spec.fills?.[0]?.token === "colors.red-50" ? "brand" : "light";

export const fromElyx: FromElyx = (node, v, exp) => {
  if (exp.set === "_keyboard-item") {
    const label = findNode(node, "label1");
    return (
      <KeyboardItem
        variant={v.variant as "number" | "operator"}
        pressed={v.pressed === "true"}
        label={textOf(node) ?? "1"}
        large={label?.text?.font.size === 22}
      />
    );
  }
  if (exp.set === "_keyboard-icon-operation") return <KeyboardOperationIcon />;
  const p = v["Property 1"];
  if (p === "android") return <Keyboard layout="android" style={{ width: node.spec.w }} />;
  if (p === "ios") return <Keyboard layout="ios" />;
  const tone = keypadTone(node);
  // The light keypad's Face ID icon is white on white in the design, i.e. invisible.
  return <Keyboard layout="pin" tone={tone} showBiometric={tone === "brand"} />;
};

export const elyxInstances = instancesFor(keyboardScene, fromElyx);
