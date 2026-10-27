import type { ButtonHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Button.module.css";

export type ButtonSize = "default" | "small";
export type ButtonVariant = "primary" | "secondary" | "textPrimary" | "neutral" | "textNeutral";
export type ButtonState = "default" | "pressed" | "disabled";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Forces a visual state for documentation. In use, pressed comes from :active and disabled from `disabled`. */
  state?: ButtonState;
  /** Icon file name in resources/assets/icons, shown before the label. */
  iconStart?: string;
  /** Icon file name, shown after the label. */
  iconEnd?: string;
  fullWidth?: boolean;
}

/** DOKU button. Elyx: controls/button.elyx, Figma set `button`. */
export function Button({
  label, size = "default", variant = "primary", state = "default", iconStart, iconEnd, fullWidth, disabled, className, ...rest
}: ButtonProps) {
  const isDisabled = disabled || state === "disabled";
  const iconSize = size === "small" ? 12 : 16;
  return (
    <button
      type="button"
      {...rest}
      disabled={isDisabled}
      data-state={isDisabled ? "disabled" : state}
      className={[styles.button, styles[size], styles[variant], fullWidth && styles.fullWidth, className].filter(Boolean).join(" ")}
    >
      {iconStart && <Icon name={iconStart} size={iconSize} tint="currentColor" />}
      <span className={styles.label}>{label}</span>
      {iconEnd && <Icon name={iconEnd} size={iconSize} tint="currentColor" />}
    </button>
  );
}
