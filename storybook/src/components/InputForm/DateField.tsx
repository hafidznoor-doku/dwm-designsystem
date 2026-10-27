import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "../Icon/Icon";
import { cx, describedBy, type FieldBaseProps, fieldStyles as styles, Helper, helperOf, LabelRow, Line, useFieldIds } from "./FieldParts";
import type { FieldState } from "./TextField";

export interface DateFieldProps extends FieldBaseProps {
  id?: string;
  name?: string;
  /** ISO date, `YYYY-MM-DD`. Controlled when set (use "" for empty). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  /** Opens your own picker (e.g. the calendar bottom sheet) instead of the native one. */
  onOpenPicker?: () => void;
  /** Formats the ISO value for display. Default: "27 Oktober 2026" (id-ID). */
  formatDate?: (iso: string) => string;
  /** Forces the focused look for documentation. */
  state?: FieldState;
}

const defaultFormat = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

/** DOKU date field: a read-only value that opens a date picker. Elyx: controls/input-form.elyx, Figma set `Input Date`. */
export function DateField({
  label, helperText, error, info, onInfoClick, className, style, id, name, value, defaultValue, onChange, placeholder = "Pilih tanggal",
  min, max, disabled, required, onOpenPicker, formatDate = defaultFormat, state = "default",
}: DateFieldProps) {
  const ids = useFieldIds(id);
  const nativeRef = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value !== undefined ? value : inner;
  const helper = helperOf(helperText, error);

  const open = () => {
    if (disabled) return;
    if (onOpenPicker) return onOpenPicker();
    const el = nativeRef.current;
    try {
      el?.showPicker();
    } catch {
      el?.focus();
    }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      className={cx(styles.field, styles.date, className)}
      style={style}
      data-state={state}
      data-invalid={error ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <div className={styles.container}>
        <LabelRow label={label} htmlFor={ids.input} labelId={ids.label} info={info} onInfoClick={onInfoClick} disabled={disabled} />
        <div className={styles.row}>
          <div className={styles.inputRow}>
            <input
              id={ids.input}
              className={styles.input}
              readOnly
              value={current ? formatDate(current) : ""}
              placeholder={placeholder}
              disabled={disabled}
              aria-haspopup="dialog"
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(helper && ids.helper)}
              onClick={open}
              onKeyDown={onKeyDown}
            />
          </div>
          <button type="button" className={styles.iconButton} onClick={open} disabled={disabled} aria-label="Pilih tanggal" tabIndex={-1}>
            <Icon name="calendar-today-outlined" size={16} tint="var(--icon)" />
          </button>
        </div>
      </div>
      <Line />
      <Helper id={ids.helper} text={helper} />
      <input
        ref={nativeRef}
        type="date"
        className={styles.nativeDate}
        name={name}
        value={current}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          if (value === undefined) setInner(e.target.value);
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
}
