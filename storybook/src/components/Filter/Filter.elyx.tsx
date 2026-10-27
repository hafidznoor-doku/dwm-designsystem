// Links <Filter> to controls/filter.elyx.
import scene from "../../generated/scenes/controls/filter.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { pillContent } from "../Pill/Pill.elyx";
import { Filter, type FilterProps } from "./Filter";

export const filterScene = scene as unknown as SceneFile;

/** The Elyx export that specifies these props. */
export const filterExport = (p: Pick<FilterProps, "size">) =>
  findVariant(filterScene, "Filter", { "Property 1": p.size === "medium" ? "Medium" : "Large" })!;

export const fromElyx: FromElyx = (node, v, exp) => {
  const pills = (node.c ?? []).filter((c) => !c.hidden);
  const options = pills.map((p, i) => ({ value: String(i), ...pillContent(p) }));
  const selected = pills.findIndex((p) => /Selected/.test(p.inst?.symbol ?? ""));
  return (
    <Filter
      key={exp.ref}
      options={options}
      defaultValue={String(Math.max(selected, 0))}
      size={v["Property 1"] === "Medium" ? "medium" : "large"}
      aria-label="Filter"
      style={node.spec.wMode === "fill" ? undefined : { width: node.spec.w }}
    />
  );
};

export const elyxInstances = instancesFor(filterScene, fromElyx);
