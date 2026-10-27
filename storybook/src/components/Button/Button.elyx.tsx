// Links <Button> to controls/button.elyx.
import scene from "../../generated/scenes/controls/button.json";
import { camelValue, iconOf, instancesFor, type FromElyx } from "../../elyx/control";
import { textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Button, type ButtonProps } from "./Button";

export const buttonScene = scene as unknown as SceneFile;

/** The Elyx export that specifies these props. */
export const buttonExport = (p: Pick<ButtonProps, "size" | "variant" | "state" | "disabled">) =>
  findVariant(buttonScene, "button", {
    Size: p.size ?? "default",
    variant: (p.variant ?? "primary").replace(/^text(\w)/, "text $1").toLowerCase(),
    state: p.disabled ? "disabled" : p.state ?? "default",
  })!;

export const fromElyx: FromElyx = (node, v) => (
  <Button
    size={v.Size as ButtonProps["size"]}
    variant={camelValue(v.variant) as ButtonProps["variant"]}
    state={v.state as ButtonProps["state"]}
    label={textOf(node, "button") ?? ""}
    iconStart={iconOf(node, "iconAdd")}
    iconEnd={iconOf(node, "adsClick")}
    fullWidth={node.spec.wMode !== "hug"}
  />
);

export const elyxInstances = instancesFor(buttonScene, fromElyx);
