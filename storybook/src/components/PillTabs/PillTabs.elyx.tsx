// Links <PillTabs> to controls/pill-tabs.elyx.
import scene from "../../generated/scenes/controls/pill-tabs.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { pillContent } from "../Pill/Pill.elyx";
import { PillTabs } from "./PillTabs";

export const pillTabsScene = scene as unknown as SceneFile;

/** The Elyx export closest to this many tabs (the design has 2–5). */
export const pillTabsExport = (p: { options?: unknown[] }) =>
  findVariant(pillTabsScene, "Pill Tabs", { Counts: `${Math.min(5, Math.max(2, p.options?.length ?? 2))} tabs` })!;

export const fromElyx: FromElyx = (node, _v, exp) => {
  const pills = (node.c ?? []).filter((c) => !c.hidden);
  const options = pills.map((p, i) => ({ value: String(i), ...pillContent(p) }));
  const selected = pills.findIndex((p) => /Selected/.test(p.inst?.symbol ?? "") || /red/.test(p.spec.fills?.[0]?.token ?? ""));
  return <PillTabs key={exp.ref} options={options} defaultValue={String(Math.max(selected, 0))} aria-label="Tab" />;
};

export const elyxInstances = instancesFor(pillTabsScene, fromElyx);
