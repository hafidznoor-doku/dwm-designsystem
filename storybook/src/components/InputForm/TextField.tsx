import { useRef, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import { Counter, cx, describedBy, type FieldBaseProps, fieldStyles as styles, Helper, helperOf, LabelRow, Line, splitIconStyle, useFieldIds } from "./FieldParts";
import { Flag, type FlagCountry, flagLabels } from "./Flag";

export type FieldState = "default" | "pressed";

export interface TextFieldProps extends FieldBaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "style" | "className"> {
  /** Text before the value, e.g. "+62" for phone numbers (shown as "+62 -"). */
  prefix?: string;
  /** Shows a country picker (flag + prefix + ▾) instead of the plain prefix. */
  flag?: FlagCountry;
  /** Called when the country picker is tapped. */
  onPrefixClick?: () => void;
  /** Shows the clear button (always visible in the design, also when empty). */
  clearable?: boolean;
  /** Shows the contacts button (phone number fields). */
  onContactClick?: () => void;
  /** Shows the "n/max" counter; needs `maxLength`. */
  showCounter?: boolean;
  /** Forces the focused look for documentation. In use it comes from real focus. */
  state?: FieldState;
}

/**
 * DOKU underline text field. Elyx: controls/input-form.elyx, Figma set
 * `Input Form` (variants=base form). Pass `type="password"` for a show/hide toggle.
 */
export function TextField({
  label, helperText, error, info, onInfoClick, className, style, prefix, flag, onPrefixClick, clearable, onContactClick, showCounter,
  state = "default", id, type = "text", value, defaultValue, onChange, disabled, maxLength, ...rest
}: TextFieldProps) {
  const ids = useFieldIds(id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const [reveal, setReveal] = useState(false);
  const current = value !== undefined ? String(value) : inner;
  const helper = helperOf(helperText, error);
  const isPassword = type === "password";
  const counter = showCounter && maxLength !== undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(e.target.value);
    onChange?.(e);
  };
  const clear = () => {
    const el = inputRef.current;
    if (!el) return;
    // Go through the native setter so React's onChange fires like a real edit.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  };

  return (
    <div
      className={cx(styles.field, className)}
      style={style}
      data-state={state}
      data-invalid={error ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <div className={styles.container}>
        <LabelRow label={label} htmlFor={ids.input} labelId={ids.label} info={info} onInfoClick={onInfoClick} disabled={disabled} />
        <div className={styles.row}>
          <div className={styles.inputRow}>
            {flag ? (
              <button type="button" className={cx(styles.iconButton, styles.prefixPicker)} onClick={onPrefixClick} disabled={disabled}
                aria-label={`Kode negara ${flagLabels[flag]} ${prefix ?? ""}`.trim()}>
                <Flag country={flag} />
                <span className={styles.prefixCodeGroup}>
                  {prefix && <span className={styles.prefixCode}>{prefix}</span>}
                  <Icon name="arrow-drop-down-outlined" size={16} tint="var(--elyx-colors-neutral-30)" />
                </span>
              </button>
            ) : prefix ? (
              <span className={styles.prefix} aria-hidden>
                <span className={styles.prefixCode}>{prefix}</span>
                <span className={styles.prefixDash}>-</span>
              </span>
            ) : null}
            <input
              {...rest}
              ref={inputRef}
              id={ids.input}
              className={styles.input}
              type={isPassword && reveal ? "text" : type}
              value={current}
              onChange={handleChange}
              disabled={disabled}
              maxLength={maxLength}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(counter && ids.counter, helper && ids.helper)}
            />
          </div>
          {(isPassword || clearable || onContactClick) && (
            <div className={styles.trailing}>
              {clearable && (
                <button type="button" className={styles.iconButton} onClick={clear} disabled={disabled} aria-label="Hapus isian">
                  <span className={cx(styles.splitIcon, styles.clearIcon)} style={splitIconStyle} />
                </button>
              )}
              {onContactClick && (
                <button type="button" className={styles.iconButton} onClick={onContactClick} disabled={disabled} aria-label="Pilih dari kontak">
                  <span className={cx(styles.splitIcon, styles.contactIcon)} style={splitIconStyle} />
                </button>
              )}
              {isPassword && (
                <button type="button" className={styles.iconButton} onClick={() => setReveal((r) => !r)} disabled={disabled}
                  aria-pressed={reveal} aria-label={reveal ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                  <Icon name="remove-red-eye" size={16} tint={reveal ? "var(--elyx-colors-neutral-60)" : "var(--elyx-colors-neutral-30)"} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Line />
      {counter && <Counter id={ids.counter} length={current.length} max={maxLength!} />}
      <Helper id={ids.helper} text={helper} />
    </div>
  );
}
