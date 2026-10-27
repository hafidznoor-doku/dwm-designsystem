// Links <Avatar> to controls/avatar.elyx.
import scene from "../../generated/scenes/controls/avatar.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Avatar, type AvatarGender, type AvatarProps } from "./Avatar";

export const avatarScene = scene as unknown as SceneFile;

/** The Elyx export that specifies these props. */
export const avatarExport = (p: Pick<AvatarProps, "gender">) => findVariant(avatarScene, "Avatar", { gender: p.gender ?? "male" })!;

export const fromElyx: FromElyx = (node, v) => (
  <Avatar gender={(v.gender as AvatarGender) ?? "male"} size={Math.round(Math.min(node.spec.w, node.spec.h))} />
);

export const elyxInstances = instancesFor(avatarScene, fromElyx);
