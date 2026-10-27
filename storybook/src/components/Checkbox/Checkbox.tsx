import type { ChangeEvent, CSSProperties, InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "checked" | "defaultChecked" | "size" | "title" | "style"> {
  /** Main label. */
  title?: string;
  /** Secondary line under the title. */
  subtitle?: string;
  /** Controlled value. Leave undefined and use `defaultChecked` for an uncontrolled checkbox. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

/** Checkbox with an optional title and subtitle. A native input, so it works with labels, Space and forms. Elyx: controls/checkbox.elyx. */
export function Checkbox({ title, subtitle, checked, defaultChecked, onChange, disabled, className, style, ...rest }: CheckboxProps) {
  return (
    <label className={[styles.checkbox, className].filter(Boolean).join(" ")} style={style} data-disabled={disabled || undefined}>
      <span className={styles.boxWrap}>
        <input
          {...rest}
          type="checkbox"
          className={styles.input}
          checked={checked}
          defaultChecked={defaultChecked}
          readOnly={checked !== undefined && !onChange}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked, e)}
        />
        <span className={styles.box} aria-hidden>
          <svg className={styles.check} viewBox="0 0 20 20" width="20" height="20">
            <path d="M8.458 12.408L6.184 10.134L5.41 10.903L8.458 13.951L15 7.408L14.231 6.639L8.458 12.408Z" fill="currentColor" />
          </svg>
        </span>
      </span>
      {(title || subtitle) && (
        <span className={styles.text}>
          {title && <span className={styles.title}>{title}</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </span>
      )}
    </label>
  );
}
