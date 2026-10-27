// Links <Pin> to controls/pin.elyx.
import scene from "../../generated/scenes/controls/pin.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile } from "../../elyx/types";
import { Pin, type PinProps } from "./Pin";

export const pinScene = scene as unknown as SceneFile;

/** The Elyx export for these props: default (empty), filled (complete) or error. */
export const pinExport = (p: Pick<PinProps, "mode" | "value" | "length" | "error">) => {
  const state = p.error ? "error" : (p.value?.length ?? 0) >= (p.length ?? 6) ? "filled" : "default";
  return findVariant(pinScene, "PIN", { "Property 1": `${p.mode ?? "authentication"} ${state}` })!;
};

export const fromElyx: FromElyx = (node, v) => {
  const [mode, state] = (v["Property 1"] ?? "authentication default").split(" ") as [PinProps["mode"], string];
  const transactional = mode === "transactional";
  return (
    <Pin
      mode={mode}
      value={state === "filled" ? "000000" : ""}
      title={textOf(node, "selamatDatangKemba")}
      subtitle={textOf(node, transactional ? "kodeVerifikasiYang" : "silahkanMasukanPin")}
      error={state === "error" ? textOf(node, "lupaPin") : undefined}
      forgotLabel={textOf(findNode(node, "button") ?? node, "button")}
      // The design's Face ID icon is white on the red keypad.
      showBiometric={!!findNode(node, "iconLayer")}
    />
  );
};

export const elyxInstances = instancesFor(pinScene, fromElyx);
