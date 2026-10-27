// Links SelectForm, DropdownList and ListOption to controls/select-form.elyx.
import scene from "../../generated/scenes/controls/select-form.json";
import { iconOf, instancesFor, type FromElyx } from "../../elyx/control";
import { findNode, isShown, textOf } from "../../elyx/Scene";
import { findVariant } from "../../elyx/scenes";
import type { SceneFile, SceneNode } from "../../elyx/types";
import { DropdownList, ListOption, type ListOptionProps, type SelectOption } from "./DropdownList";
import { SelectForm, type SelectFormProps } from "./SelectForm";

export const selectFormScene = scene as unknown as SceneFile;

/** The Elyx export that specifies these SelectForm props. */
export const selectFormExport = (p: Partial<SelectFormProps>) => {
  const s = p.disabled ? "disable" : p.error ? "error" : p.state === "pressed" || p.open ? "pressed"
    : (p.value ?? p.defaultValue) ? "filled" : "default";
  return findVariant(selectFormScene, "Select Form", { State: s })!;
};
export const dropdownListExport = (count: number) => {
  const n = count >= 10 ? "10" : count >= 5 ? "5" : "1";
  return findVariant(selectFormScene, "Dropdown List", { "Property 1": n })!;
};
export const listOptionExport = (p: Partial<ListOptionProps>) => {
  const s = p.disabled ? "disabled" : p.state === "pressed" ? "presed" : p.selected ? "selected" : "default";
  return findVariant(selectFormScene, "_list-option", { state: s })!;
};

const fillOf = (n?: SceneNode) => n?.spec.fills?.[0]?.token ?? n?.spec.fills?.[0]?.value ?? "";
const visibleChildren = (n: SceneNode) => (n.c ?? []).filter((c) => !c.hidden);
const optionsOf = (list: SceneNode): SelectOption[] =>
  visibleChildren(list)
    .filter((c) => /^listOption/.test(c.n))
    .map((c, i) => ({ value: `option-${i + 1}`, label: textOf(c, "textLayer") ?? "" }));

export const fromElyx: FromElyx = (node, v, exp) => {
  const width = node.spec.wMode === "fill" ? "100%" : node.spec.w;
  switch (exp.set) {
    case "Select Form": {
      const s = v.State;
      const valueNode = findNode(node, "value");
      const text = valueNode?.text?.content ?? "";
      const filled = /neutral-80/.test(fillOf(valueNode));
      const list = findNode(node, "dropdownList");
      const options = list ? optionsOf(list) : [];
      if (filled) options.unshift({ value: "current", label: text });
      return (
        <SelectForm
          style={{ width }}
          label={textOf(node, "noPonsel") ?? ""}
          info={isShown(findNode(node, "frame1") ?? node, "info")}
          options={options}
          defaultValue={filled ? "current" : null}
          placeholder={filled ? undefined : text}
          helperText={isShown(node, "textHelper") ? textOf(node, "textHelper") : undefined}
          error={s === "error"}
          disabled={s === "disable"}
          state={s === "pressed" ? "pressed" : "default"}
          defaultOpen={!!list && !list.hidden}
        />
      );
    }
    case "Dropdown List": {
      const add = findNode(node, "addListOption");
      return (
        <DropdownList
          style={{ width }}
          options={optionsOf(node)}
          addLabel={add && !add.hidden ? textOf(add, "textLayer") : undefined}
        />
      );
    }
    case "_list-option":
      return (
        <ListOption
          hug={node.spec.wMode === "hug"}
          label={textOf(node, "textLayer") ?? ""}
          selected={v.state === "selected"}
          disabled={v.state === "disabled"}
          state={v.state === "presed" ? "pressed" : "default"}
          iconStart={iconOf(node, "biArrowRightCircle")}
          iconEnd={iconOf(node, "biArrowRightCircle2")}
        />
      );
  }
  return null;
};

export const elyxInstances = instancesFor(selectFormScene, fromElyx);
