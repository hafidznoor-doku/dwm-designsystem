import { useState, type HTMLAttributes, type KeyboardEvent } from "react";
import { Pill, type PillAppearance, type PillSize } from "../Pill/Pill";
import styles from "./PillTabs.module.css";

export interface PillOption {
  value: string;
  label: string;
  /** Icon file name in resources/assets/icons. */
  icon?: string;
  disabled?: boolean;
}

/** Accepts plain labels too; a label is then also its value. */
export type PillOptionInput = string | PillOption;
export const toOption = (o: PillOptionInput): PillOption => (typeof o === "string" ? { value: o, label: o } : o);

export interface PillGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: PillOptionInput[];
  /** Controlled selection. Leave undefined and use `defaultValue` for an uncontrolled group. */
  value?: string;
  /** Defaults to the first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: PillSize;
}

/** Shared single-select pill row used by PillTabs (tablist) and Filter (radiogroup). */
export function usePillGroup({ options, value, defaultValue, onChange }: Pick<PillGroupProps, "options" | "value" | "defaultValue" | "onChange">) {
  const items = options.map(toOption);
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const current = value ?? inner;
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    if (v !== current) onChange?.(v);
  };
  /** Arrow keys move selection and focus, skipping disabled options (roving tabindex). */
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const enabled = items.filter((o) => !o.disabled);
    if (!step || !enabled.length) return;
    e.preventDefault();
    const at = enabled.findIndex((o) => o.value === current);
    const next = enabled[(at + step + enabled.length) % enabled.length];
    select(next.value);
    (e.currentTarget.querySelector(`[data-value="${CSS.escape(next.value)}"]`) as HTMLElement | null)?.focus();
  };
  return { items, current, select, onKeyDown };
}

export interface PillTabsProps extends PillGroupProps {
  appearance?: PillAppearance;
}

/**
 * Row of pill-shaped tabs that switch the content below. Elyx: controls/pill-tabs.elyx,
 * Figma set `Pill Tabs` (2–5 tabs of `_pill` Medium).
 */
export function PillTabs({ options, value, defaultValue, onChange, size = "medium", appearance = "pill", className, ...rest }: PillTabsProps) {
  const { items, current, select, onKeyDown } = usePillGroup({ options, value, defaultValue, onChange });
  return (
    <div role="tablist" {...rest} className={[styles.tabs, className].filter(Boolean).join(" ")} onKeyDown={onKeyDown}>
      {items.map((o) => {
        const on = o.value === current;
        return (
          <Pill
            key={o.value}
            role="tab"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            data-value={o.value}
            label={o.label}
            icon={o.icon}
            size={size}
            appearance={appearance}
            selected={on}
            disabled={o.disabled}
            onClick={() => select(o.value)}
          />
        );
      })}
    </div>
  );
}
