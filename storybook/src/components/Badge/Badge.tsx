import type { HTMLAttributes, MouseEventHandler } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./Badge.module.css";

/** Account verification (KYC) level. */
export type BadgeStatus = "unverified" | "pending" | "verified";

const DEFAULTS: Record<BadgeStatus, { label: string; iconStart?: string; iconEnd?: string }> = {
  unverified: { label: "Basic", iconEnd: "add-round" },
  pending: { label: "Verifikasi Diproses", iconStart: "hourglass-bottom-outlined", iconEnd: "chevron-right" },
  verified: { label: "Premium", iconStart: "verified-round" },
};

export interface BadgeProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  /** Sets the color and the default label and icons. Figma: belum- / sedang- / sudah-verifikasi. */
  status?: BadgeStatus;
  /** Defaults to the status's label (Basic, Verifikasi Diproses, Premium). */
  label?: string;
  /** Icon file name before the label. `null` hides the status's default icon. */
  iconStart?: string | null;
  /** Icon file name after the label (plus or chevron as a call to action). `null` hides it. */
  iconEnd?: string | null;
  /** Makes the badge a button, e.g. to start or check verification. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/** Account level badge shown next to the user's name. Elyx: controls/badge.elyx, Figma set `Badge`. */
export function Badge({ status = "verified", label, iconStart, iconEnd, onClick, className, ...rest }: BadgeProps) {
  const d = DEFAULTS[status];
  const start = iconStart === undefined ? d.iconStart : iconStart;
  const end = iconEnd === undefined ? d.iconEnd : iconEnd;
  const content = (
    <>
      {start && <Icon name={start} size={12} tint="currentColor" />}
      <span className={styles.label}>{label ?? d.label}</span>
      {end && <Icon name={end} size={12} tint="var(--icon-end)" />}
    </>
  );
  const cls = [styles.badge, styles[status], onClick && styles.interactive, className].filter(Boolean).join(" ");
  return onClick ? (
    <button type="button" {...(rest as HTMLAttributes<HTMLButtonElement>)} className={cls} onClick={onClick}>{content}</button>
  ) : (
    <span {...rest} className={cls}>{content}</span>
  );
}
