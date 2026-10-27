// Links <VerificationCode>, <VerificationChanceInfo> and <VerificationScreen> to controls/verification-code.elyx.
import scene from "../../generated/scenes/controls/verification-code.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { VerificationChanceInfo, VerificationCode, type VerificationCodeProps } from "./VerificationCode";
import { VerificationScreen } from "./VerificationScreen";

export const verificationScene = scene as unknown as SceneFile;

/** The Elyx export for these props. */
export const verificationExport = (p: Pick<VerificationCodeProps, "channel" | "status" | "value" | "length" | "chancesLeft">) => {
  const type =
    p.status === "wrong" ? `wrong-sisa-${(p.chancesLeft ?? 2) <= 1 ? 1 : 2}`
    : p.status === "expired" ? "expired"
    : (p.value?.length ?? 0) > 0 ? "filled" : "default";
  return findVariant(verificationScene, "Verification Code", { phase: p.channel ?? "sms", type })!;
};

const parseCountdown = (t = "") => {
  const m = /(\d+):(\d+)/.exec(t);
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
};
const parseChances = (t = "") => Number(/Sisa (\d+)/.exec(t)?.[1] ?? 2);

/** Props of the code block as drawn in an Elyx node. */
function codeProps(node: SceneNode, v: Record<string, string>): VerificationCodeProps {
  const type = v.type ?? "default";
  const subtitle = textOf(node, "kodeVerifikasiYang") ?? "";
  const chance = textOf(node, "verificationChanceInfo") ?? "";
  const cells = findNode(node, "pinInput")?.c ?? [];
  const digits = cells.map((c) => textOf(c) ?? "").join("");
  return {
    channel: (v.phase as VerificationCodeProps["channel"]) ?? "sms",
    destination: subtitle.split(/ke:\s*/)[1] ?? "",
    value: type === "default" ? "" : digits,
    status: type.startsWith("wrong") ? "wrong" : type === "expired" ? "expired" : "default",
    error: textOf(node, "kodeVerifikasiSala"),
    countdown: parseCountdown(chance),
    chancesLeft: parseChances(chance),
    title: textOf(node, "masukanKodeVerifik"),
  };
}

export const fromElyx: FromElyx = (node, v, exp) => {
  if (exp.set === "_verification-chance-info") {
    const t = textOf(node) ?? "";
    return <VerificationChanceInfo countdown={parseCountdown(t)} chancesLeft={parseChances(t)} style={{ width: node.spec.w }} />;
  }
  if (exp.set === "_template-verif-code") {
    const slot = findNode(node, "slotComponent")!;
    const ref = slot.inst ? verificationScene.exports.find((e) => e.ref === slot.inst!.symbol) : undefined;
    return <VerificationScreen title={textOf(node, "header")} code={codeProps(slot, ref?.props ?? {})} />;
  }
  return <VerificationCode {...codeProps(node, v)} style={{ width: node.spec.w }} />;
};

export const elyxInstances = instancesFor(verificationScene, fromElyx);
