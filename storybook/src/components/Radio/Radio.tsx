import type { ChangeEvent, CSSProperties, InputHTMLAttributes } from "react";
import styles from "./Radio.module.css";

export type RadioSize = "large" | "small";
/** Indicator sizes: 25 dp (Radio Button large), 24 dp (`_master_checkbox` large), 16 dp (small). */
export type RadioIndicatorSize = "large" | "medium" | "small";

export interface RadioIndicatorProps {
  size?: RadioIndicatorSize;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * The circle on its own, for custom rows that handle selection themselves
 * (e.g. a list item with the radio at the end). Figma set `_master_checkbox`.
 */
export function RadioIndicator({ size = "large", checked, disabled, className }: RadioIndicatorProps) {
  return (
    <span
      aria-hidden
      className={[styles.indicator, styles[size], checked && styles.checked, disabled && styles.disabled, className].filter(Boolean).join(" ")}
    />
  );
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked" | "defaultChecked" | "size" | "title" | "style"> {
  /** Main label. */
  label?: string;
  /** Secondary line under the label. */
  subtitle?: string;
  size?: RadioSize;
  /** Controlled value. Leave undefined and use `defaultChecked`, or group radios with the same `name`. */
  checked?: boolean;
  defaultChecked?: boolean;
  /** Called when this radio becomes selected. */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

/** Single-choice option. A native radio input: group options with `name`, arrow keys move the selection. Elyx: controls/radio.elyx, Figma set `Radio Button`. */
export function Radio({ label, subtitle, size = "large", checked, defaultChecked, onChange, disabled, className, style, ...rest }: RadioProps) {
  return (
    <label className={[styles.radio, styles[size], className].filter(Boolean).join(" ")} style={style} data-disabled={disabled || undefined}>
      <span className={styles.control}>
        <input
          {...rest}
          type="radio"
          className={styles.input}
          checked={checked}
          defaultChecked={defaultChecked}
          readOnly={checked !== undefined && !onChange}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value, e)}
        />
        <RadioIndicator size={size} />
      </span>
      {(label || subtitle) && (
        <span className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </span>
      )}
    </label>
  );
}
