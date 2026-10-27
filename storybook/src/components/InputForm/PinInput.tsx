import { useState, type CSSProperties, type InputHTMLAttributes } from "react";
import styles from "./PinInput.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export type PinTone = "default" | "error";

export interface PinCellProps {
  /** The digit shown; empty renders the empty cell. */
  digit?: string;
  tone?: PinTone;
  /** Marks the cell that receives the next digit. */
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** One OTP digit box. Elyx: controls/input-form.elyx, private Figma set `_master_pin-password-input`. */
export function PinCell({ digit, tone = "default", active, className, style }: PinCellProps) {
  return (
    <span
      className={cx(styles.cell, className)}
      style={style}
      data-tone={tone}
      data-empty={digit ? undefined : ""}
      data-active={active ? "" : undefined}
      aria-hidden
    >
      {digit && <span className={styles.digit}>{digit}</span>}
    </span>
  );
}

interface CodeProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "maxLength" | "size" | "type"> {
  /** Number of digits. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every digit is entered. */
  onComplete?: (value: string) => void;
  /** Wrong code: red cells (verification-code screens). */
  error?: boolean;
  /** Accessible name, e.g. "Kode verifikasi". */
  label?: string;
}

function useCode({ length = 6, value, defaultValue, onChange, onComplete }: CodeProps) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = (value ?? inner).slice(0, length);
  const set = (raw: string) => {
    const next = raw.replace(/\D/g, "").slice(0, length);
    if (value === undefined) setInner(next);
    onChange?.(next);
    if (next.length === length && current.length !== length) onComplete?.(next);
  };
  return { current, set, length };
}

export interface PinInputProps extends CodeProps {}

/** Six-digit one-time code entry. Elyx: controls/input-form.elyx, Figma `PIN input`. */
export function PinInput(props: PinInputProps) {
  const { length = 6, value, defaultValue, onChange, onComplete, error, label = "Kode verifikasi", className, style, disabled, ...rest } = props;
  const { current, set } = useCode(props);
  return (
    <div className={cx(styles.group, className)} style={style}>
      <input
        {...rest}
        className={styles.native}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={current}
        disabled={disabled}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        onChange={(e) => set(e.target.value)}
      />
      {Array.from({ length }, (_, i) => (
        <PinCell key={i} digit={current[i]} tone={error ? "error" : "default"} active={i === Math.min(current.length, length - 1)} />
      ))}
    </div>
  );
}

export interface PasswordInputProps extends CodeProps {}

/** Six-dot PIN / password entry; digits are never shown. Elyx: controls/input-form.elyx, Figma `Password input`. */
export function PasswordInput(props: PasswordInputProps) {
  const { length = 6, value, defaultValue, onChange, onComplete, error, label = "PIN", className, style, disabled, ...rest } = props;
  const { current, set } = useCode(props);
  return (
    <div className={cx(styles.group, styles.password, className)} style={style} data-tone={error ? "error" : "default"}>
      <input
        {...rest}
        className={styles.native}
        type="password"
        inputMode="numeric"
        autoComplete="off"
        pattern="[0-9]*"
        maxLength={length}
        value={current}
        disabled={disabled}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        onChange={(e) => set(e.target.value)}
      />
      {Array.from({ length }, (_, i) => (
        <span key={i} className={styles.dot} data-filled={i < current.length ? "" : undefined}
          data-active={i === Math.min(current.length, length - 1) ? "" : undefined} aria-hidden />
      ))}
    </div>
  );
}
