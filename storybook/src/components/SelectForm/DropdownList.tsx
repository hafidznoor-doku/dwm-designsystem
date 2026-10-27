import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./SelectForm.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type ListOptionState = "default" | "pressed";

export interface ListOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  /** Keyboard highlight (aria-activedescendant target). */
  active?: boolean;
  /** Forces the pressed look for documentation. In use it comes from :active. */
  state?: ListOptionState;
  /** Icon before / after the label (file name in resources/assets/icons). */
  iconStart?: string;
  iconEnd?: string;
  /** Hug the content instead of filling the list width. */
  hug?: boolean;
}

/** One row of a dropdown list. Elyx: controls/select-form.elyx, private Figma set `_list-option`. */
export function ListOption({ label, selected, disabled, active, state = "default", iconStart, iconEnd, hug, className, ...rest }: ListOptionProps) {
  return (
    <div
      role="option"
      aria-selected={selected ? true : false}
      aria-disabled={disabled || undefined}
      data-active={active ? "" : undefined}
      data-state={state}
      data-hug={hug ? "" : undefined}
      className={cx(styles.option, className)}
      {...rest}
    >
      {iconStart && <Icon name={iconStart} size={12} tint="currentColor" />}
      <span className={styles.optionLabel}>{label}</span>
      {iconEnd && <Icon name={iconEnd} size={12} tint="currentColor" />}
    </div>
  );
}

export interface DropdownListProps {
  options: SelectOption[];
  /** Selected value. */
  value?: string | null;
  /** Highlighted value (keyboard). */
  activeValue?: string | null;
  onSelect?: (option: SelectOption) => void;
  /** "Add list menu" row with a + icon above the options (hidden in the design by default). */
  addLabel?: string;
  onAdd?: () => void;
  id?: string;
  /** Builds each option's DOM id, for aria-activedescendant. */
  optionId?: (value: string) => string;
  "aria-labelledby"?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Dropdown list panel (listbox). Elyx: controls/select-form.elyx, Figma set `Dropdown List`. */
export function DropdownList({
  options, value, activeValue, onSelect, addLabel, onAdd, id, optionId, className, style, children, ...aria
}: DropdownListProps) {
  return (
    <div role="listbox" id={id} className={cx(styles.list, className)} style={style} aria-labelledby={aria["aria-labelledby"]}>
      {addLabel && (
        <div className={styles.addOption}>
          <ListOption label={addLabel} iconStart="bi-plus" aria-selected={undefined} role="button" onClick={onAdd}
            onMouseDown={(e) => e.preventDefault()} />
          <div className={styles.divider} aria-hidden />
        </div>
      )}
      {options.map((o) => (
        <ListOption
          key={o.value}
          id={optionId?.(o.value)}
          label={o.label}
          selected={o.value === value}
          active={o.value === activeValue}
          disabled={o.disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => !o.disabled && onSelect?.(o)}
        />
      ))}
      {children}
    </div>
  );
}
