import { useMemo, useState } from "react";
import { tokens } from "../elyx/scenes";
import type { Token } from "../elyx/types";
import icons from "../generated/icons.json";
import colorsXml from "../generated/platform/colors.xml?raw";
import dimensXml from "../generated/platform/dimens.xml?raw";
import swift from "../generated/platform/DokuTokens.swift?raw";
import "./foundations.css";

const all = [...tokens.values()];
const byScope = (scope: string) => all.filter((t) => t.scope === scope);

function Names({ t }: { t: Token }) {
  return (
    <div className="fd-names">
      <code>{t.key}</code>
      <code>{t.android}</code>
      <code>{t.ios}</code>
    </div>
  );
}

export function ColorsPage() {
  const ramps = useMemo(() => {
    const groups = new Map<string, Token[]>();
    for (const t of byScope("colors")) {
      const hue = t.name.replace(/-\w+$/, "");
      groups.set(hue, [...(groups.get(hue) ?? []), t]);
    }
    const step = (t: Token) => (/\d+$/.test(t.name) ? +t.name.match(/\d+$/)![0] : 1000);
    for (const list of groups.values()) list.sort((a, b) => step(a) - step(b));
    return [...groups];
  }, []);
  return (
    <div className="fd">
      <h1>Colors</h1>
      <p className="fd-lead">
        Use semantic roles in product code. They alias the primitive ramps below. <code>colors.red-50</code> (#E1251B) is the DOKU brand red.
        Each swatch lists the Elyx token, the Android resource and the iOS constant (downloads under Foundations / Platform tokens).
      </p>
      <h2>Semantic roles</h2>
      <table className="fd-table">
        <thead><tr><th /><th>Role</th><th>Alias of</th><th>Hex</th><th>Android</th><th>iOS</th></tr></thead>
        <tbody>
          {byScope("semantic").map((t) => (
            <tr key={t.key}>
              <td><span className="fd-chip" style={{ background: t.value as string }} /></td>
              <td><code>{t.key}</code></td>
              <td><code>{t.alias}</code></td>
              <td><code>{t.hex}</code></td>
              <td><code>{t.android}</code></td>
              <td><code>{t.ios}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Primitive ramps</h2>
      {ramps.map(([hue, list]) => (
        <section key={hue} className="fd-ramp">
          <h3>{hue}</h3>
          <div className="fd-swatches">
            {list.map((t) => (
              <div key={t.key} className="fd-swatch">
                <div className="fd-color" style={{ background: t.value as string }} />
                <strong>{t.name}</strong>
                <span>{t.hex}</span>
                <Names t={t} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const WEIGHTS: [string, number][] = [["Regular", 400], ["Medium", 500], ["Bold", 700]];

export function TypographyPage() {
  const sizes = byScope("font-sizes");
  const lineHeight = (name: string) => tokens.get(`line-heights.${name}`)?.value as number | undefined;
  return (
    <div className="fd">
      <h1>Typography</h1>
      <p className="fd-lead">
        Components are set in <strong>DIN Next LT Pro</strong> (Regular, Medium, Bold). The newer guideline moves to <strong>Inter</strong> at the same scale.
        Sizes are sp on Android and pt on iOS; line height is the absolute value to set (Android <code>lineHeight</code>, iOS line height via <code>lineSpacing</code> = line height − font size).
      </p>
      <table className="fd-table">
        <thead><tr><th>Step</th><th>Size</th><th>Line height</th><th>Android</th><th>iOS</th><th>Samples</th></tr></thead>
        <tbody>
          {sizes.map((t) => {
            const lh = lineHeight(t.name);
            const px = lh ? Math.round(lh * (t.value as number) * 10) / 10 : undefined;
            return (
              <tr key={t.key}>
                <td><code>{t.name}</code></td>
                <td>{t.value} sp</td>
                <td>{px ? `${px} sp (×${lh})` : "auto"}</td>
                <td><code>{t.android}</code></td>
                <td><code>{t.ios}</code></td>
                <td>
                  {WEIGHTS.map(([w, n]) => (
                    <div key={w} style={{ fontFamily: "var(--doku-font-brand)", fontSize: t.value as number, lineHeight: lh, fontWeight: n }}>
                      {w} · Transfer Berhasil Rp100.000
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function SpacingPage() {
  return (
    <div className="fd">
      <h1>Spacing &amp; radius</h1>
      <p className="fd-lead">Lengths are dp on Android and pt on iOS (1 Elyx px = 1 dp = 1 pt). The spec under each component names these tokens next to matching values.</p>
      <h2>Spacing</h2>
      <table className="fd-table">
        <thead><tr><th>Token</th><th>Value</th><th /><th>Android</th><th>iOS</th></tr></thead>
        <tbody>
          {byScope("spacing").map((t) => (
            <tr key={t.key}>
              <td><code>{t.key}</code></td>
              <td>{t.value} dp</td>
              <td><span className="fd-bar" style={{ width: t.value as number }} /></td>
              <td><code>{t.android}</code></td>
              <td><code>{t.ios}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Corner radius</h2>
      <div className="fd-radii">
        {byScope("radius").map((t) => (
          <div key={t.key} className="fd-radius">
            <div style={{ borderRadius: Math.min(t.value as number, 32) }} />
            <code>{t.key}</code>
            <span>{t.value} dp</span>
            <code>{t.android}</code>
            <code>{t.ios}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IconsPage() {
  const [q, setQ] = useState("");
  const list = (icons as string[]).filter((n) => n.includes(q.toLowerCase().trim()));
  return (
    <div className="fd">
      <h1>Icons</h1>
      <p className="fd-lead">
        {icons.length} SVGs in <code>resources/assets/icons/</code>. Single-color icons are drawn in black and tinted with a color token
        (Android: vector drawable + <code>tint</code>; iOS: template rendering mode + <code>foregroundStyle</code>).
      </p>
      <input className="fd-search" placeholder="Search icons" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="fd-icons">
        {list.map((n) => (
          <button key={n} className="fd-icon" title={`Copy “${n}”`} onClick={() => navigator.clipboard?.writeText(n)}>
            <img src={`resources/assets/icons/${n}.svg`} alt="" loading="lazy" />
            <span>{n}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const FILES = [
  { name: "colors.xml", path: "app/src/main/res/values/colors.xml", body: colorsXml, type: "text/xml" },
  { name: "dimens.xml", path: "app/src/main/res/values/dimens.xml", body: dimensXml, type: "text/xml" },
  { name: "DokuTokens.swift", path: "Sources/DesignSystem/DokuTokens.swift", body: swift, type: "text/x-swift" },
];

export function PlatformTokensPage() {
  return (
    <div className="fd">
      <h1>Platform tokens</h1>
      <p className="fd-lead">
        Generated from <code>tokens/*.elyx</code> on every <code>npm run sync</code>. Semantic colors reference the primitives, so changing a ramp in Elyx updates both apps.
      </p>
      {FILES.map((f) => (
        <section key={f.name} className="fd-file">
          <header>
            <strong>{f.name}</strong> <span>→ {f.path}</span>
            <button onClick={() => navigator.clipboard?.writeText(f.body)}>Copy</button>
            <a download={f.name} href={URL.createObjectURL(new Blob([f.body], { type: f.type }))}>Download</a>
          </header>
          <pre>{f.body}</pre>
        </section>
      ))}
    </div>
  );
}
