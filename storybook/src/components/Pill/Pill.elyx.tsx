// Links <Pill> (sets _pill, _filter-pill) and <PillSwitch> (set switch) to controls/pill.elyx.
import scene from "../../generated/scenes/controls/pill.json";
import { iconOf, instancesFor, type FromElyx } from "../../elyx/control";
import { textOf } from "../../elyx/Scene";
import { exportOf, findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { Pill, type PillProps } from "./Pill";
import { PillSwitch } from "./PillSwitch";

export const pillScene = scene as unknown as SceneFile;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** The Elyx export that specifies these props. */
export const pillExport = (p: Pick<PillProps, "size" | "appearance" | "selected" | "disabled">) => {
  const Size = cap(p.size ?? "medium");
  return p.appearance === "filter"
    ? findVariant(pillScene, "_filter-pill", { "Property 1": p.selected ? "selected" : "default", Size })!
    : findVariant(pillScene, "_pill", { state: p.disabled ? "disabled" : p.selected ? "selected" : "default", Size })!;
};

export const pillSwitchExport = () => exportOf(pillScene, "switch");

/** A pill node's label and optional icon (the icon layer is `creditCard` in pills, any asset in switch segments). */
export const pillContent = (node: SceneNode) => ({
  label: textOf(node, "qris") ?? textOf(node) ?? "",
  icon: iconOf(node, "creditCard") ?? iconOf(node, node.c?.find((c) => c.t === "asset")?.n ?? ""),
});

export const fromElyx: FromElyx = (node, v, exp) => {
  if (exp.set === "switch") {
    const segments = (node.c ?? []).filter((c) => !c.hidden);
    const options = segments.map((s, i) => ({ value: String(i), ...pillContent(s) }));
    const selected = segments.findIndex((s) => s.spec.fills?.length);
    return <PillSwitch key={exp.ref} options={options} defaultValue={String(Math.max(selected, 0))} aria-label="Metode" />;
  }
  const filter = exp.set === "_filter-pill";
  const state = filter ? v["Property 1"] : v.state;
  return (
    <Pill
      {...pillContent(node)}
      appearance={filter ? "filter" : "pill"}
      size={v.Size?.toLowerCase() === "large" ? "large" : "medium"}
      selected={state === "selected"}
      disabled={state === "disabled"}
    />
  );
};

export const elyxInstances = instancesFor(pillScene, fromElyx);
