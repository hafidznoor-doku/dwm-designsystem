// Links the InputForm components to controls/input-form.elyx.
import scene from "../../generated/scenes/controls/input-form.json";
import { instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, isShown, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { DateField, type DateFieldProps } from "./DateField";
import { Flag, type FlagCountry } from "./Flag";
import { PasswordInput, PinCell, PinInput } from "./PinInput";
import { SearchField, type SearchFieldProps } from "./SearchField";
import { TextArea, type TextAreaProps } from "./TextArea";
import { TextField, type TextFieldProps } from "./TextField";

export const inputFormScene = scene as unknown as SceneFile;

type DocState = "default" | "pressed" | "filled" | "invalid" | "disabled";
const docState = (p: { state?: string; disabled?: boolean; error?: unknown; value?: unknown; defaultValue?: unknown }): DocState =>
  p.disabled ? "disabled" : p.error ? "invalid" : p.state === "pressed" ? "pressed" : p.value || p.defaultValue ? "filled" : "default";

/** The Elyx export that specifies these TextField props. */
export const textFieldExport = (p: Partial<TextFieldProps>) =>
  findVariant(inputFormScene, "Input Form", { variants: "base form", states: docState(p) })!;
export const searchFieldExport = (p: Partial<SearchFieldProps>) =>
  findVariant(inputFormScene, "Input Form", { variants: "search", states: docState(p) })!;
export const textAreaExport = (p: Partial<TextAreaProps>) => {
  const s = docState(p);
  return findVariant(inputFormScene, "Input Area", { "Property 1": s === "invalid" ? "default" : s })!;
};
export const dateFieldExport = (p: Partial<DateFieldProps>) => {
  const s = docState(p);
  return findVariant(inputFormScene, "Input Date", { states: s === "disabled" || s === "pressed" ? s : "default" })!;
};
export const pinInputExport = () => inputFormScene.exports.find((e) => e.ref === "pinInput")!;
export const passwordInputExport = () => inputFormScene.exports.find((e) => e.ref === "passwordInput")!;
export const flagExport = (country: FlagCountry) =>
  inputFormScene.exports.find((e) => e.set === "flag" && e.props!["Property 1"].toLowerCase().replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase()) === country)!;

// ---- reading an Elyx node ----

const fillOf = (n?: SceneNode) => n?.spec.fills?.[0]?.token ?? n?.spec.fills?.[0]?.value ?? "";
/** Placeholder text is drawn in neutral-30 (#ABB4C0) or #CCC in the design; entered text is darker. */
const isPlaceholder = (n?: SceneNode) => /neutral-30|neutral-40|204 204 204|179 179 179/.test(fillOf(n));
const widthOf = (n: SceneNode) => (n.spec.wMode === "fill" ? "100%" : n.spec.w);

function valueProps(node: SceneNode, layer: string) {
  const v = findNode(node, layer);
  const text = v?.text?.content ?? "";
  return isPlaceholder(v) ? { placeholder: text } : { placeholder: "", defaultValue: text };
}

const flagFromAsset = (n?: SceneNode): FlagCountry | undefined => {
  const src = n?.asset?.src ?? "";
  if (src.includes("indonesia")) return "indonesia";
  if (src.includes("singapore")) return "singapore";
  if (src.includes("malaysia")) return "malaysia";
  if (src.includes("flag-flags-property-25")) return "unitedStates";
  return undefined;
};

const stateOf = (v: Record<string, string>) => (v.states ?? v["Property 1"] ?? "default").toLowerCase();

const shownIn = (node: SceneNode, parent: string, name: string) => {
  const p = findNode(node, parent);
  return !!p && !p.hidden && isShown(p, name);
};

export const fromElyx: FromElyx = (node, v, exp) => {
  const s = stateOf(v);
  const common = {
    style: { width: widthOf(node) },
    disabled: s === "disabled",
    state: s === "pressed" ? ("pressed" as const) : ("default" as const),
  };
  const helper = isShown(node, "textHelper") ? textOf(node, "textHelper") : undefined;
  const invalid = s === "invalid";

  switch (exp.set) {
    case "Input Form": {
      if (v.variants === "search") {
        return (
          <SearchField
            {...common}
            label={textOf(node, "namaKamu") ?? ""}
            info={shownIn(node, "label", "biInfoCircleFill")}
            {...valueProps(node, "label81234567901")}
            helperText={helper}
            error={invalid}
          />
        );
      }
      const withFlag = findNode(node, "withFlag");
      const flag = withFlag && !withFlag.hidden ? flagFromAsset(findNode(withFlag, "flag")) : undefined;
      const plain = findNode(node, "withoutFlag");
      const prefix = flag ? textOf(withFlag!, "label62") : plain && !plain.hidden ? textOf(plain, "label62") : undefined;
      const right = isShown(node, "rightIcons");
      return (
        <TextField
          {...common}
          label={textOf(node, "noPonsel") ?? ""}
          info={shownIn(node, "frame1", "info")}
          prefix={prefix}
          flag={flag}
          {...valueProps(node, "value")}
          clearable={right}
          onContactClick={right ? () => {} : undefined}
          maxLength={isShown(node, "characterIndicator") ? 255 : undefined}
          showCounter={isShown(node, "characterIndicator")}
          helperText={helper}
          error={invalid}
        />
      );
    }
    case "Input Area":
      return (
        <TextArea
          {...common}
          label={textOf(node, "noPonsel") ?? ""}
          info={shownIn(node, "frame1", "info")}
          {...valueProps(node, "value")}
          maxLength={255}
          showCounter={isShown(node, "characterIndicator")}
          helperText={helper}
        />
      );
    case "Input Date": {
      const val = findNode(node, "value");
      return (
        <DateField
          {...common}
          label={textOf(node, "noPonsel") ?? ""}
          info={shownIn(node, "frame1", "info")}
          placeholder={val?.text?.content}
        />
      );
    }
    case "PIN input": {
      const cells = (node.c ?? []).filter((c) => !c.hidden);
      return <PinInput length={cells.length} style={{ width: widthOf(node) }} />;
    }
    case "Password input":
      return <PasswordInput length={(node.c ?? []).filter((c) => !c.hidden).length} />;
    case "_master_pin-password-input":
      return <PinCell digit={textOf(node, "label1") ?? ""} tone={/red/.test(fillOf(node)) ? "error" : "default"} />;
    case "flag":
      return <Flag country={flagExportCountry(v["Property 1"])} />;
  }
  return null;
};

const flagExportCountry = (p: string) => p.toLowerCase().replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase()) as FlagCountry;

export const elyxInstances = instancesFor(inputFormScene, fromElyx);
