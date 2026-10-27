import type { StoryObj } from "@storybook/react-vite";
import type { FromElyx } from "../elyx/control";
import { renderOf } from "../elyx/scenes";
import type { SceneExport, SceneFile } from "../elyx/types";
import "./spec.css";

interface MatrixProps {
  scene: SceneFile;
  fromElyx: FromElyx;
  sets?: string[];
  /** Show the Elyx render next to each live variant. */
  reference?: boolean;
}

/** Every Figma variant of a control, built with the coded component. */
export function StatesMatrix({ scene, fromElyx, sets, reference = true }: MatrixProps) {
  const exports = scene.exports.filter((e) => !sets || sets.includes(e.set));
  return (
    <div className="matrix">
      {exports.map((e) => (
        <figure key={e.ref} className="matrix-cell">
          <div className="matrix-pair">
            <div>{fromElyx(e.root, e.props ?? {}, e)}</div>
            {reference && renderOf(scene.file, e.ref) && (
              <img className="matrix-ref" src={renderOf(scene.file, e.ref)} width={e.root.spec.w} alt="" title="Elyx reference" />
            )}
          </div>
          <figcaption>{e.props ? Object.entries(e.props).map(([k, v]) => `${k}=${v}`).join(", ") : e.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Story showing every variant: live (left) and Elyx reference (right). */
export function matrixStory(scene: SceneFile, fromElyx: FromElyx, sets?: string[]): StoryObj {
  return {
    name: "All variants",
    render: () => <StatesMatrix scene={scene} fromElyx={fromElyx} sets={sets} />,
    parameters: { controls: { disable: true }, elyxSpec: undefined },
  };
}

/**
 * One story that renders any Elyx export of the control with the coded
 * component; pick it in Controls. scripts/check-visual.mjs drives this story.
 */
export function elyxVariantStory(scene: SceneFile, fromElyx: FromElyx, sets?: string[]): StoryObj {
  const exports = scene.exports.filter((e) => !sets || sets.includes(e.set));
  const byRef = new Map<string, SceneExport>(exports.map((e) => [e.ref, e]));
  return {
    name: "Elyx variant",
    args: { exportRef: exports[0].ref },
    argTypes: { exportRef: { name: "Elyx export", control: "select", options: exports.map((e) => e.ref) } },
    render: (args) => {
      const e = byRef.get((args as { exportRef: string }).exportRef)!;
      return <div data-visual-root>{fromElyx(e.root, e.props ?? {}, e)}</div>;
    },
    parameters: {
      elyxSpec: (args: { exportRef: string }) => {
        const e = byRef.get(args.exportRef)!;
        return { file: scene.file, scene: e, live: fromElyx(e.root, e.props ?? {}, e) };
      },
    },
  };
}
