import type { ButtonHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Pill.module.css";

export type PillSize = "large" | "medium";
/** `pill` = Figma `_pill` (tabs, red when selected); `filter` = Figma `_filter-pill` (grey when selected). */
export type PillAppearance = "pill" | "filter";

export interface PillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  /** Icon file name in resources/assets/icons, shown before the label. */
  icon?: string;
  size?: PillSize;
  appearance?: PillAppearance;
  selected?: boolean;
}

/**
 * Selectable chip. Usually rendered by <PillTabs> or <Filter>; on its own it is
 * a toggle button (`aria-pressed`). Elyx: controls/pill.elyx, sets `_pill` and `_filter-pill`.
 */
export function Pill({ label, icon, size = "medium", appearance = "pill", selected = false, disabled, className, ...rest }: PillProps) {
  return (
    <button
      type="button"
      aria-pressed={rest.role ? undefined : selected}
      {...rest}
      disabled={disabled}
      data-selected={selected || undefined}
      className={[styles.chip, styles[appearance], styles[size], className].filter(Boolean).join(" ")}
    >
      {icon && <Icon name={icon} size={12} tint="currentColor" />}
      <span className={styles.label}>{label}</span>
    </button>
  );
}
