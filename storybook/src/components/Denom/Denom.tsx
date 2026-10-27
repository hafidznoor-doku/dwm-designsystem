import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./Denom.module.css";

// ---------------------------------------------------------------------------
// .denom-atom

export interface DenomOptionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** `nominal` shows an amount (and optional price); `channel` shows a payment-channel logo. */
  variant?: "nominal" | "channel";
  /** Amount, e.g. "50.000". */
  label?: string;
  /** Price line under the amount, e.g. "Harga Rp 51.500". */
  price?: string;
  /** Logo for `channel` options: an image URL or any node (max 73 × 32). */
  logo?: ReactNode;
  /** Accessible name when the option only shows a logo. */
  logoLabel?: string;
  selected?: boolean;
  /** Centres the amount (used in the 3-column wallet grid). */
  centered?: boolean;
}

/** One selectable top-up amount or payment channel. Figma set `.denom-atom`. */
export function DenomOption({ variant = "nominal", label, price, logo, logoLabel, selected = false, centered, className, ...rest }: DenomOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={variant === "channel" ? logoLabel : undefined}
      {...rest}
      data-selected={selected || undefined}
      className={[styles.option, styles[variant], centered && styles.centered, className].filter(Boolean).join(" ")}
    >
      {variant === "channel" ? (
        <span className={styles.logo}>{typeof logo === "string" ? <img src={logo} alt="" /> : logo}</span>
      ) : (
        <>
          <span className={styles.amount}>{label}</span>
          {price && <span className={styles.price}>{price}</span>}
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Denom

export interface DenomItem {
  value: string;
  /** Amount shown, e.g. "50.000". Defaults to `value`. */
  label?: string;
  price?: string;
  logo?: ReactNode;
  /** Accessible name for logo options, e.g. "OVO". */
  logoLabel?: string;
  disabled?: boolean;
}

/**
 * - `wallet` — 3 columns of amounts (DOKU wallet top-up).
 * - `pulsa` — 2 columns of amount + price (phone credit).
 * - `channel` — 2 columns of payment-channel logos (wallet navigation).
 */
export type DenomLayout = "wallet" | "pulsa" | "channel";

const GRID: Record<DenomLayout, string> = { wallet: styles.gridWallet, pulsa: styles.gridPulsa, channel: styles.gridChannel };

export interface DenomProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: DenomItem[];
  layout?: DenomLayout;
  /** Selected item's value. */
  value?: string;
  onChange?: (value: string) => void;
  /** Accessible name of the group. */
  label?: string;
}

/** Single-choice grid of top-up amounts or channels. Elyx: controls/denom.elyx, Figma set `Denom`. */
export function Denom({ items, layout = "wallet", value, onChange, label = "Pilih nominal", className, style, ...rest }: DenomProps) {
  const columns = layout === "wallet" ? 3 : 2;
  return (
    <div
      {...rest}
      role="radiogroup"
      aria-label={label}
      className={[styles.denom, GRID[layout], className].filter(Boolean).join(" ")}
      style={{ "--columns": columns, ...style } as CSSProperties}
    >
      {items.map((it) => (
        <DenomOption
          key={it.value}
          variant={layout === "channel" ? "channel" : "nominal"}
          label={it.label ?? it.value}
          price={layout === "pulsa" ? it.price : undefined}
          logo={it.logo}
          logoLabel={it.logoLabel ?? it.value}
          centered={layout === "wallet"}
          disabled={it.disabled}
          selected={it.value === value}
          onClick={() => onChange?.(it.value)}
        />
      ))}
    </div>
  );
}
