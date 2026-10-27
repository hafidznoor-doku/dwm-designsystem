import { useId, type ChangeEvent, type CSSProperties, type InputHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Toggle.module.css";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked" | "defaultChecked" | "size" | "style"> {
  /** Controlled on/off. Leave undefined and use `defaultChecked` for an uncontrolled toggle. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Accessible name when the toggle has no visible label. */
  "aria-label"?: string;
  style?: CSSProperties;
}

/**
 * On/off switch. A native checkbox with `role="switch"`, so it works with
 * Space, labels and forms. Elyx: controls/toggle.elyx, Figma set `Toggle`.
 */
export function Toggle({ checked, defaultChecked, onChange, disabled, className, style, ...rest }: ToggleProps) {
  return (
    <span className={[styles.toggle, className].filter(Boolean).join(" ")} style={style}>
      <input
        {...rest}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        defaultChecked={defaultChecked}
        readOnly={checked !== undefined && !onChange}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked, e)}
      />
      <span className={styles.track} aria-hidden />
      <span className={styles.thumb} aria-hidden />
    </span>
  );
}

export interface ToggleListItemProps extends Omit<ToggleProps, "aria-label"> {
  label: string;
  /** Icon file name in resources/assets/icons, shown before the label. */
  icon?: string;
}

/** Settings row: icon, label, and a toggle at the end. The whole row is the toggle's label. Figma set `_toggle-list`. */
export function ToggleListItem({ label, icon, className, style, id, ...toggle }: ToggleListItemProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={[styles.listItem, className].filter(Boolean).join(" ")} style={style}>
      <span className={styles.listLead}>
        {icon && <Icon name={icon} size={24} tint="currentColor" />}
        <span className={styles.listLabel}>{label}</span>
      </span>
      <Toggle {...toggle} id={inputId} />
    </label>
  );
}
