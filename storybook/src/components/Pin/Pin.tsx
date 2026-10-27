import { useState, type HTMLAttributes } from "react";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { Keyboard, type KeyboardKey } from "../Keyboard/Keyboard";
import styles from "./Pin.module.css";

// ---------------------------------------------------------------------------
// PIN dots

export interface PinDotsProps extends HTMLAttributes<HTMLDivElement> {
  /** How many digits have been entered. */
  filled: number;
  /** PIN length. */
  length?: number;
  /** `sm` = 16 dp dots (authentication), `md` = 20 dp (transactional). */
  size?: "sm" | "md";
}

/** Row of PIN dots: entered digits in white, the rest in red-80. For use on the red PIN screen. */
export function PinDots({ filled, length = 6, size = "sm", className, ...rest }: PinDotsProps) {
  return (
    <div
      {...rest}
      className={[styles.dots, styles[size], className].filter(Boolean).join(" ")}
      role="img"
      aria-label={`${filled} dari ${length} digit PIN dimasukkan`}
    >
      {Array.from({ length }, (_, i) => (
        <span key={i} className={styles.dot} data-filled={i < filled || undefined} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PIN

export type PinMode = "authentication" | "transactional";

export interface PinProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** `authentication` = login (greeting, no app bar); `transactional` = confirm a payment (back button). */
  mode?: PinMode;
  /** Entered digits. Leave undefined for an uncontrolled PIN. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once all digits are entered. */
  onComplete?: (value: string) => void;
  length?: number;
  /** Greeting above the prompt (authentication only). */
  title?: string;
  subtitle?: string;
  /** Error message under the dots. */
  error?: string;
  forgotLabel?: string;
  onForgot?: () => void;
  /** Back button (transactional only). */
  onBack?: () => void;
  /** Shows the Face ID key; called when pressed. */
  onBiometric?: () => void;
  showBiometric?: boolean;
}

/**
 * Full-screen PIN entry on brand red with its own keypad. Elyx: controls/pin.elyx, Figma set `PIN`.
 * Typing clears a shown error, as the user starts again.
 */
export function Pin({
  mode = "authentication", value, defaultValue = "", onChange, onComplete, length = 6,
  title = "Selamat Datang Kembali", subtitle = "Silakan Masukkan PIN", error, forgotLabel = "LUPA PIN?",
  onForgot, onBack, onBiometric, showBiometric = true, className, ...rest
}: PinProps) {
  const [inner, setInner] = useState(defaultValue);
  const pin = value ?? inner;
  const set = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
    if (next.length === length && pin.length < length) onComplete?.(next);
  };
  const onKey = (k: KeyboardKey) => {
    if (k === "backspace") set(pin.slice(0, -1));
    else if (k === "biometric") onBiometric?.();
    else if (/^\d$/.test(k) && pin.length < length) set(pin + k);
  };
  const transactional = mode === "transactional";
  const dots = <PinDots filled={pin.length} length={length} size={transactional ? "md" : "sm"} />;
  const forgot = <Button variant="textPrimary" label={forgotLabel} className={styles.forgot} onClick={onForgot} />;

  return (
    <div {...rest} className={[styles.pin, styles[mode], className].filter(Boolean).join(" ")}>
      {transactional ? (
        <div className={styles.appBar}>
          <button type="button" className={styles.back} aria-label="Kembali" onClick={onBack}>
            <Icon name="arrow-back-round" size={20} tint="currentColor" />
          </button>
        </div>
      ) : (
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      )}
      <div className={styles.entry}>
        {transactional && <p className={styles.subtitle}>{subtitle}</p>}
        <div className={styles.status}>
          <div className={styles.dotsBlock}>
            {dots}
            {error && <p className={styles.error} role="alert">{error}</p>}
          </div>
          {forgot}
        </div>
      </div>
      <Keyboard layout="pin" tone="brand" className={styles.keypad} showBiometric={showBiometric} onKey={onKey} />
    </div>
  );
}
