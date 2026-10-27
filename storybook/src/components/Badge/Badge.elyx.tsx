// Links <Badge> to controls/badge.elyx.
import scene from "../../generated/scenes/controls/badge.json";
import { iconOf, instancesFor, type FromElyx } from "../../elyx/control";
import { textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Badge, type BadgeStatus } from "./Badge";

export const badgeScene = scene as unknown as SceneFile;

const STATUS: Record<string, BadgeStatus> = {
  "belum-verifikasi": "unverified",
  "sedang-verifikasi": "pending",
  "sudah-verifikasi": "verified",
};

/** The Elyx export that specifies these props. */
export const badgeExport = (p: { status?: BadgeStatus }) =>
  findVariant(badgeScene, "Badge", { "Property 1": Object.keys(STATUS).find((k) => STATUS[k] === (p.status ?? "verified"))! })!;

export const fromElyx: FromElyx = (node, v, exp) => (
  <Badge
    key={exp.ref}
    status={STATUS[v["Property 1"]] ?? "verified"}
    label={textOf(node, "textLayer") ?? ""}
    // A hidden icon layer means "no icon" (null), not "status default".
    iconStart={iconOf(node, "add") ?? null}
    iconEnd={iconOf(node, "add2") ?? null}
  />
);

export const elyxInstances = instancesFor(badgeScene, fromElyx);
