// Hidden story used by scripts/check-visual.mjs: renders any Elyx export the
// way Storybook shows it (coded control if one is mapped, else the live scene).
import type { Meta, StoryObj } from "@storybook/react-vite";
import { instanceRenderers } from "../../src/components/registry";
import { Scene } from "../../src/elyx/Scene";
import type { SceneFile } from "../../src/elyx/types";

const scenes = import.meta.glob<SceneFile>("../../src/generated/scenes/**/*.json", { eager: true, import: "default" });

/** "controls__button--buttonDefaultPrimaryDefault" → file + ref (URL args allow only a few characters). */
function render({ exportKey }: { exportKey: string }) {
  const [fileKey, ref] = exportKey.split("--");
  const file = `${fileKey.replace(/__/g, "/")}.elyx`;
  const scene = Object.values(scenes).find((s) => s.file === file);
  const exp = scene?.exports.find((e) => e.ref === ref);
  if (!exp) return <p>Unknown export {exportKey}</p>;
  const coded = instanceRenderers[`${file}#${ref}`];
  return (
    <div data-visual-root style={{ display: "inline-block", verticalAlign: "top", padding: 160 }}>
      {coded ? coded(exp.root) : <Scene scene={exp} />}
    </div>
  );
}

const meta: Meta<typeof render> = {
  title: "Internal/Visual check",
  component: render,
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "fullscreen", backgrounds: { disable: true } },
  args: { exportKey: "controls__button--buttonDefaultPrimaryDefault" },
};
export default meta;

export const Export: StoryObj<typeof render> = {};
