import { useState, type HTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./PillSwitch.module.css";

export interface PillSwitchOption {
  value: string;
  label: string;
  /** Icon file name in resources/assets/icons. */
  icon?: string;
}

export interface PillSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: PillSwitchOption[];
  /** Controlled selection. Leave undefined and use `defaultValue` for an uncontrolled switch. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Compact segmented switch between a few modes (e.g. scan QRIS vs. pay with card).
 * Radio-group semantics: one option is always selected. Elyx: controls/pill.elyx, Figma set `switch`.
 */
export function PillSwitch({ options, value, defaultValue, onChange, className, ...rest }: PillSwitchProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  const move = (from: number, step: number) => {
    const next = options[(from + step + options.length) % options.length];
    select(next.value);
    return next.value;
  };
  return (
    <div role="radiogroup" {...rest} className={[styles.switch, className].filter(Boolean).join(" ")}>
      {options.map((o, i) => {
        const on = o.value === current;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            data-selected={on || undefined}
            className={styles.segment}
            onClick={() => select(o.value)}
            onKeyDown={(e) => {
              const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const v = move(i, step);
              (e.currentTarget.parentElement?.querySelector(`[data-value="${CSS.escape(v)}"]`) as HTMLElement | null)?.focus();
            }}
            data-value={o.value}
          >
            {o.icon && <Icon name={o.icon} size={12} tint="currentColor" />}
            <span className={styles.label}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
