import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Keyboard.module.css";

/** A key value emitted by the keypads. Digits are "0"–"9". */
export type KeyboardKey =
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "backspace" | "biometric" | "," | "." | "-" | "space" | "done";

/**
 * - `pin` — DOKU's own full-width PIN keypad (3 × 4, no key borders).
 * - `android` / `ios` — mock-ups of the native numeric keyboards, for screen ideation.
 */
export type KeyboardLayout = "pin" | "android" | "ios";
/** PIN keypad colouring: `light` on white sheets, `brand` on the red PIN screen. */
export type KeyboardTone = "light" | "brand";

const icon = (name: string) => `url("resources/assets/icons/${name}.svg")`;

// ---------------------------------------------------------------------------
// _keyboard-item

export interface KeyboardItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** `number` keys show a digit; `operator` keys show an icon on a grey key. */
  variant?: "number" | "operator";
  /** Digit or character for number keys. */
  label?: string;
  /** Icon file name for operator keys. */
  icon?: string;
  /** Forces the pressed look for documentation. In use it comes from :active. */
  pressed?: boolean;
  /** The design has a second pressed number key set at 22 px. */
  large?: boolean;
}

/** One 52 × 52 calculator-style key. Figma set `_keyboard-item`. */
export function KeyboardItem({ variant = "number", label, icon: iconName = "keyboard-icon-operation-divide", pressed, large, className, ...rest }: KeyboardItemProps) {
  return (
    <button
      type="button"
      {...rest}
      data-pressed={pressed || undefined}
      className={[styles.item, styles[variant], large && styles.large, className].filter(Boolean).join(" ")}
    >
      {variant === "number" ? <span className={styles.itemLabel}>{label}</span> : <Icon name={iconName} size={20} tint="var(--elyx-colors-neutral-80)" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// _keyboard-icon-operation

/** Outlined backspace glyph (28 × 28). Figma set `_keyboard-icon-operation`. */
export function KeyboardOperationIcon({ className, color = "#4d4d4d", ...rest }: HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  // #4D4D4D is off-palette in the design.
  const part = (name: string, style: CSSProperties) => (
    <span className={styles.opPart} style={{ ...style, background: color, maskImage: icon(name), WebkitMaskImage: icon(name) }} />
  );
  return (
    <span {...rest} role="img" aria-label="Hapus" className={[styles.opIcon, className].filter(Boolean).join(" ")}>
      {part("path", { left: 3, top: 7, width: 22.39, height: 14.46 })}
      {part("path-2", { left: 13.75, top: 11, width: 6.34, height: 6.34 })}
      {part("path-2", { left: 13.75, top: 11, width: 6.34, height: 6.34, transform: "scaleX(-1)" })}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Keyboard Number

export interface KeyboardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onKeyDown"> {
  layout?: KeyboardLayout;
  /** Colouring of the `pin` layout. */
  tone?: KeyboardTone;
  /** Called for every key press. */
  onKey?: (key: KeyboardKey) => void;
  /** Shows the Face ID key bottom-left on the `pin` layout. */
  showBiometric?: boolean;
  /** Shows the OS navigation bar (Android) or home indicator (iOS). */
  systemBar?: boolean;
  disabled?: boolean;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const IOS_LETTERS: Record<string, string> = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ" };
const KEY_LABEL: Partial<Record<KeyboardKey, string>> = {
  backspace: "Hapus", biometric: "Face ID", space: "Spasi", done: "Selesai", "-": "Minus", ",": "Koma", ".": "Titik",
};

/** Numeric keypad. Every key is a button that calls `onKey`. Elyx: controls/keyboard.elyx, Figma set `Keyboard Number`. */
export function Keyboard({ layout = "pin", tone = "light", onKey, showBiometric = true, systemBar = true, disabled, className, ...rest }: KeyboardProps) {
  const key = (k: KeyboardKey, content: ReactNode, cls: string, style?: CSSProperties) => (
    <button
      key={k}
      type="button"
      className={cls}
      style={style}
      disabled={disabled}
      aria-label={KEY_LABEL[k] ?? k}
      onClick={() => onKey?.(k)}
    >
      {content}
    </button>
  );

  if (layout === "android") {
    const cell = (k: KeyboardKey, label: string, col: number, row: number) =>
      key(k, <span className={styles.androidLabel}>{label}</span>, `${styles.androidKey} ${k === "," || k === "." ? styles.androidPunct : ""}`, { gridColumn: col, gridRow: row });
    const art = (k: KeyboardKey, name: string, row: number) => key(k, null, `${styles.androidKey} ${styles.androidArt}`, { gridColumn: 4, gridRow: row, backgroundImage: icon(name) });
    return (
      <div {...rest} className={[styles.keyboard, styles.android, className].filter(Boolean).join(" ")} role="group" aria-label="Keyboard angka">
        <div className={styles.androidKeys}>
          {DIGITS.map((d, i) => cell(d, d, (i % 3) + 1, Math.floor(i / 3) + 1))}
          {cell(",", ",", 1, 4)}
          {cell("0", "0", 2, 4)}
          {cell(".", ".", 3, 4)}
          {art("-", "group-5", 1)}
          {art("space", "group-4", 2)}
          {art("backspace", "group-3", 3)}
          {art("done", "action-button-done-light-big", 4)}
        </div>
        {systemBar && <span className={styles.androidNav} style={{ backgroundImage: icon("nav-bar-light") }} aria-hidden />}
      </div>
    );
  }

  if (layout === "ios") {
    const cell = (d: KeyboardKey) =>
      key(
        d,
        <>
          <span className={styles.iosNumber}>{d}</span>
          {d !== "0" && <span className={styles.iosLetters}>{IOS_LETTERS[d] ?? ""}</span>}
        </>,
        `${styles.iosKey} ${d === "0" ? styles.iosZero : ""}`,
      );
    return (
      <div {...rest} className={[styles.keyboard, styles.ios, className].filter(Boolean).join(" ")} role="group" aria-label="Keyboard angka">
        <div className={styles.iosKeys}>
          {DIGITS.map(cell)}
          <span />
          {cell("0")}
          {key("backspace", <Icon name="delete" size={32} tint="currentColor" />, styles.iosDelete)}
        </div>
        {systemBar && <span className={styles.iosHome} aria-hidden />}
      </div>
    );
  }

  // pin
  const brand = tone === "brand";
  return (
    <div
      {...rest}
      className={[styles.keyboard, styles.pin, brand ? styles.brand : styles.light, className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Keyboard PIN"
    >
      {DIGITS.map((d) => key(d, <span className={styles.pinLabel}>{d}</span>, styles.pinKey))}
      {showBiometric ? key("biometric", <Icon name="icon-face-id" size={32} tint="currentColor" />, `${styles.pinKey} ${styles.pinIcon}`) : <span className={styles.pinBlank} />}
      {key("0", <span className={styles.pinLabel}>0</span>, styles.pinKey)}
      {key("backspace", null, `${styles.pinKey} ${styles.pinBackspace}`, { backgroundImage: icon(brand ? "group-13-2" : "group-13") })}
    </div>
  );
}
