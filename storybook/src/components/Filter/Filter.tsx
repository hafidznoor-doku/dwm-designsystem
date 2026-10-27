import type { CSSProperties } from "react";
import { Pill } from "../Pill/Pill";
import { usePillGroup, type PillGroupProps } from "../PillTabs/PillTabs";
import styles from "./Filter.module.css";

export interface FilterProps extends PillGroupProps {
  style?: CSSProperties;
}

/**
 * Horizontally scrolling row of filter pills with 16 dp side insets, e.g. to
 * filter a transaction list. Single choice (radio group). Elyx: controls/filter.elyx,
 * Figma set `Filter` (Large 40 / Medium 32 high `_filter-pill`s).
 */
export function Filter({ options, value, defaultValue, onChange, size = "large", className, ...rest }: FilterProps) {
  const { items, current, select, onKeyDown } = usePillGroup({ options, value, defaultValue, onChange });
  return (
    <div role="radiogroup" {...rest} className={[styles.filter, className].filter(Boolean).join(" ")} onKeyDown={onKeyDown}>
      {items.map((o) => {
        const on = o.value === current;
        return (
          <Pill
            key={o.value}
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            data-value={o.value}
            label={o.label}
            icon={o.icon}
            size={size}
            appearance="filter"
            selected={on}
            disabled={o.disabled}
            onClick={() => select(o.value)}
          />
        );
      })}
    </div>
  );
}
