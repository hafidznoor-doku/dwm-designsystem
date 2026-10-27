// Links <Denom> and <DenomOption> to controls/denom.elyx.
import scene from "../../generated/scenes/controls/denom.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { Denom, DenomOption, type DenomItem, type DenomLayout } from "./Denom";

export const denomScene = scene as unknown as SceneFile;

const LAYOUT_OF: Record<string, DenomLayout> = { "topup wallet": "wallet", "topup pulsa": "pulsa", "wallet navigation": "channel" };

/** The Elyx export for a Denom layout. */
export const denomExport = (p: { layout?: DenomLayout }) =>
  findVariant(denomScene, "Denom", { Variants: Object.keys(LAYOUT_OF).find((k) => LAYOUT_OF[k] === (p.layout ?? "wallet"))! })!;

/** The Elyx export for a single option. */
export const denomOptionExport = (p: { variant?: "nominal" | "channel"; selected?: boolean }) =>
  p.variant === "channel"
    ? findVariant(denomScene, ".denom-atom", { Variants: "payment channel" })!
    : findVariant(denomScene, ".denom-atom", { Variants: "nominal", State: p.selected ? "chosen" : "default" })!;

const LOGO_GOPAY = "resources/assets/icons/emoney-gopay.svg";

/** A logo layer (asset, or frame with cropped bitmaps) drawn as in the design. */
export function LogoFromNode({ node }: { node: SceneNode }) {
  if (node.asset) return <img src={node.asset.src} width={node.spec.w} height={node.spec.h} alt="" />;
  return (
    <span style={{ position: "relative", display: "block", width: node.spec.w, height: node.spec.h, overflow: "hidden" }}>
      {(node.c ?? []).map((c, i) => {
        const img = c.spec.fills?.find((f) => f.type === "image")?.image;
        return img ? (
          <img key={i} src={img} alt="" style={{ position: "absolute", left: c.spec.x, top: c.spec.y, width: c.spec.w, height: c.spec.h, maxWidth: "none", maxHeight: "none" }} />
        ) : null;
      })}
    </span>
  );
}

/** Ready-made payment-channel logos from the design (OVO, ShopeePay, GoPay, …). */
export const channelItems: DenomItem[] = (() => {
  const nav = findVariant(denomScene, "Denom", { Variants: "wallet navigation" })!.root;
  const names = ["OVO", "ShopeePay", "GoPay", "Lainnya"];
  return optionNodes(nav).map((n, i) => ({ value: names[i] ?? `channel-${i}`, logoLabel: names[i], logo: logoOf(n) }));
})();

function optionNodes(root: SceneNode): SceneNode[] {
  return (root.c ?? []).flatMap((row) => (row.c ?? []).filter((c) => !c.hidden));
}

function logoOf(option: SceneNode) {
  // One channel is a flattened SVG of a whole GoPay option.
  if (option.asset) return <img src={LOGO_GOPAY} width={73} height={30.44} alt="" />;
  const logo = findNode(option, "emoneyGopay");
  return logo ? <LogoFromNode node={logo} /> : undefined;
}

export const fromElyx: FromElyx = (node, v, exp) => {
  if (exp.set === ".denom-atom") {
    if (v.Variants === "payment channel") return <DenomOption variant="channel" logo={logoOf(node)} logoLabel="GoPay" />;
    return (
      <DenomOption
        selected={v.State === "chosen"}
        label={textOf(node, "label15000")}
        price={textOf(node, "hargaRp15000")}
      />
    );
  }
  const layout = LAYOUT_OF[v.Variants] ?? "wallet";
  const items: DenomItem[] = optionNodes(node).map((o, i) =>
    layout === "channel"
      ? channelItems[i]
      : { value: textOf(o, "label15000") ?? String(i), price: findNode(o, "hargaRp15000")?.hidden ? undefined : textOf(o, "hargaRp15000") },
  );
  const [pt, pr, pb, pl] = node.spec.layout?.pad ?? [0, 0, 0, 0];
  return <Denom layout={layout} items={items} style={{ width: node.spec.w, padding: `${pt}px ${pr}px ${pb}px ${pl}px` }} />;
};

export const elyxInstances = instancesFor(denomScene, fromElyx);
