import { useMemo, useState, type ReactNode } from "react";
import { compose, swiftui } from "../elyx/platform";
import { Scene } from "../elyx/Scene";
import { renderOf, visualOf } from "../elyx/scenes";
import {
  anatomy, colorHex, colorRows, dp, lengthToken, paddingText, radiusText, sizeText, textNodes, tokenOf, type Part,
} from "../elyx/spec";
import type { Paint, SceneExport, SceneNode } from "../elyx/types";
import "./spec.css";

interface SpecSheetProps {
  file: string;
  scene: SceneExport;
  /** The live coded component, shown next to the Elyx reference. */
  live?: ReactNode;
}

/** Developer spec for one Elyx export. All values come from the design file. */
export function SpecSheet({ file, scene, live }: SpecSheetProps) {
  const parts = useMemo(() => anatomy(scene.root), [scene]);
  const [hover, setHover] = useState<Part | null>(null);
  const root = scene.root.spec;

  return (
    <section className="spec">
      <header className="spec-head">
        <h2>Spec</h2>
        <p>
          <strong>{scene.title}</strong> · <code>{file}</code> → <code>{scene.ref}</code>
        </p>
        <p className="spec-note">
          Units: 1 Elyx px = 1 dp (Android) = 1 pt (iOS). Font sizes are sp. Values are read from the design, not from the web code.
        </p>
      </header>

      <Section title="Anatomy" hint="Hover a row to outline the layer and its padding.">
        <div className="spec-anatomy">
          <div className="spec-stage">
            <Scene scene={scene} codedControls={false} />
            <div className="spec-overlay" style={{ width: root.w, height: root.h }}>
              {parts.map((p) => (
                <span key={p.no} className={`spec-pin${hover?.no === p.no ? " is-on" : ""}`} style={{ left: p.x, top: p.y }}>
                  {p.no}
                </span>
              ))}
              {hover && <Redline part={hover} />}
            </div>
          </div>
          <table className="spec-table">
            <thead><tr><th>#</th><th>Layer</th><th>Kind</th><th>Size (dp)</th><th>Position</th></tr></thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.no} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)}>
                  <td className="spec-no">{p.no}</td>
                  <td style={{ paddingLeft: 8 + (p.depth - 1) * 12 }}>{p.node.n}</td>
                  <td>{kind(p.node)}</td>
                  <td>{sizeText(p.node.spec)}</td>
                  <td>{p.node.spec.absolute ? "absolute " : ""}{dp(p.x)}, {dp(p.y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Layout & spacing">
        <table className="spec-table">
          <thead><tr><th>Layer</th><th>Size (dp)</th><th>Direction</th><th>Padding</th><th>Gap</th><th>Radius</th><th>Align</th></tr></thead>
          <tbody>
            {[{ node: scene.root }, ...parts.filter((p) => p.node.spec.layout || p.node.spec.radius != null)].map(({ node }) => (
              <tr key={node.cls}>
                <td>{node.n}</td>
                <td>{sizeText(node.spec)}</td>
                <td>{node.spec.layout ? (node.spec.layout.dir === "row" ? "Row (horizontal)" : "Column (vertical)") : "Free (absolute children)"}</td>
                <td>{node.spec.layout ? withToken(paddingText(node.spec.layout.pad), "spacing", node.spec.layout.pad) : ""}</td>
                <td>{node.spec.layout ? withToken(dp(node.spec.layout.gap), "spacing", [node.spec.layout.gap]) : ""}</td>
                <td>{typeof node.spec.radius === "number" ? withToken(dp(node.spec.radius), "radius", [node.spec.radius]) : radiusText(node.spec.radius)}</td>
                <td>{node.spec.layout ? `${node.spec.layout.justify} / ${node.spec.layout.align}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Colors" hint="Use the token, not the hex. Rows marked off-palette have no token in the design.">
        <table className="spec-table">
          <thead><tr><th>Layer</th><th>Role</th><th /><th>Token</th><th>Hex</th><th>Android</th><th>iOS</th></tr></thead>
          <tbody>
            {colorRows(scene.root).map((r, i) => <ColorRow key={i} layer={r.layer} role={r.role} paint={r.paint} />)}
          </tbody>
        </table>
      </Section>

      <Section title="Typography">
        <table className="spec-table">
          <thead><tr><th>Sample</th><th>Font</th><th>Weight</th><th>Size</th><th>Line height</th><th>Letter spacing</th><th>Color</th></tr></thead>
          <tbody>
            {textNodes(scene.root).map((n) => {
              const f = n.text!.font;
              const c = n.spec.fills?.[0];
              return (
                <tr key={n.cls}>
                  <td className="spec-sample" style={{ fontFamily: `"${f.family}"`, fontWeight: f.weight, fontSize: f.size }}>{n.text!.content.slice(0, 40)}</td>
                  <td>{f.family}</td>
                  <td>{f.style} ({f.weight})</td>
                  <td>{dp(f.size)} sp</td>
                  <td>{f.lineHeightPx ? `${dp(f.lineHeightPx)} sp (×${f.lineHeight})` : "auto"}</td>
                  <td>{f.letterSpacing === "0%" ? "0" : f.letterSpacing}</td>
                  <td>{c ? <code>{tokenOf(c.token) ? c.token : colorHex(c)}</code> : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section title="Platform skeletons" hint="Structure, sizes and token names to implement from. Not drop-in code.">
        <PlatformCode node={scene.root} />
      </Section>

      <Section title="Design reference" hint={`Left: Elyx render (source of truth). Right: live web component.${visualText(visualOf(file, scene.ref))}`}>
        <div className="spec-compare">
          <figure>
            {renderOf(file, scene.ref) ? <img src={renderOf(file, scene.ref)} width={root.w} alt={scene.title} /> : <em>No render yet. Run npm run sync.</em>}
            <figcaption>Elyx</figcaption>
          </figure>
          <figure>
            {live ?? <Scene scene={scene} />}
            <figcaption>Live</figcaption>
          </figure>
        </div>
      </Section>
    </section>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="spec-section">
      <h3>{title}</h3>
      {hint && <p className="spec-hint">{hint}</p>}
      {children}
    </div>
  );
}

function Redline({ part }: { part: Part }) {
  const s = part.node.spec;
  const pad = s.layout?.pad;
  return (
    <div className="spec-redline" style={{ left: part.x, top: part.y, width: s.w, height: s.h }}>
      {pad && pad.some(Boolean) && (
        <div className="spec-redline-pad" style={{ borderTopWidth: pad[0], borderRightWidth: pad[1], borderBottomWidth: pad[2], borderLeftWidth: pad[3] }} />
      )}
      <span className="spec-redline-size">{dp(s.w)} × {dp(s.h)}</span>
    </div>
  );
}

function ColorRow({ layer, role, paint }: { layer: string; role: string; paint: Paint }) {
  const t = tokenOf(paint.token);
  if (paint.type === "image") {
    return <tr><td>{layer}</td><td>{role}</td><td /><td colSpan={4}><code>{paint.image}</code></td></tr>;
  }
  if (paint.type === "gradient") {
    const stops = paint.gradient!.stops.map((s) => `${colorHex({ ...paint, token: null, value: s.color })} ${Math.round(s.position * 100)}%`).join(" → ");
    return <tr><td>{layer}</td><td>{role}</td><td /><td colSpan={4}>{paint.gradient!.kind}: {stops}</td></tr>;
  }
  return (
    <tr>
      <td>{layer}</td>
      <td>{role}</td>
      <td><span className="spec-swatch" style={{ background: paint.value ?? undefined }} /></td>
      <td>{t ? <code>{t.key}</code> : <span className="spec-warn">off-palette</span>}</td>
      <td><code>{colorHex(paint)}</code></td>
      <td>{t ? <code>{t.android}</code> : ""}</td>
      <td>{t ? <code>{t.ios}</code> : ""}</td>
    </tr>
  );
}

function PlatformCode({ node }: { node: SceneNode }) {
  const [tab, setTab] = useState<"compose" | "swiftui">("compose");
  const code = useMemo(() => (tab === "compose" ? compose(node) : swiftui(node)), [tab, node]);
  return (
    <div className="spec-code">
      <div className="spec-tabs">
        <button className={tab === "compose" ? "is-on" : ""} onClick={() => setTab("compose")}>Android · Compose</button>
        <button className={tab === "swiftui" ? "is-on" : ""} onClick={() => setTab("swiftui")}>iOS · SwiftUI</button>
        <button className="spec-copy" onClick={() => navigator.clipboard?.writeText(code)}>Copy</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

const kind = (n: SceneNode) =>
  n.inst ? `Instance · ${n.inst.symbol}` : n.text ? "Text" : n.asset ? (n.asset.tinted ? "Icon (tinted)" : "Image / icon") : n.t === "frame" ? (n.spec.layout ? "Stack" : "Frame") : n.t;

function withToken(text: string, scope: "spacing" | "radius", values: number[]) {
  const names = [...new Set(values.filter(Boolean).map((v) => lengthToken(scope, v)?.key).filter(Boolean))];
  return names.length ? <>{text} <span className="spec-token">{names.join(", ")}</span></> : text;
}

function visualText(v?: { diff?: number; sizeDelta?: number[]; error?: string }) {
  if (!v) return " Run npm run check:visual for a pixel diff.";
  if (v.error) return ` Visual check failed: ${v.error}`;
  return ` Pixel diff ${v.diff}%, size off by ${v.sizeDelta!.join(" × ")} dp.`;
}
