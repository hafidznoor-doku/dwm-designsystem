import { useEffect, useState, type HTMLAttributes } from "react";
import { PinInput } from "../InputForm/PinInput";
import styles from "./VerificationCode.module.css";

export type VerificationChannel = "sms" | "whatsapp" | "email";
/** `wrong` = the code was rejected, `expired` = the code timed out. */
export type VerificationStatus = "default" | "wrong" | "expired";

const CHANNEL_NAME: Record<VerificationChannel, string> = { sms: "SMS", whatsapp: "WhatsApp", email: "Email" };

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

/** Counts down once a second from `seconds`; restart by changing `key` or calling `restart`. */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    setLeft(seconds);
    if (seconds <= 0) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? (clearInterval(id), 0) : s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds, epoch]);
  return { left, restart: () => setEpoch((e) => e + 1) };
}

// ---------------------------------------------------------------------------
// _verification-chance-info

export interface VerificationChanceInfoProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds until the code can be resent. 0 shows the resend action. */
  countdown: number;
  /** Resends left. */
  chancesLeft: number;
  onResend?: () => void;
}

/** Resend countdown, or the resend action once it reaches zero. Figma set `_verification-chance-info`. */
export function VerificationChanceInfo({ countdown, chancesLeft, onResend, className, ...rest }: VerificationChanceInfoProps) {
  return (
    <div {...rest} className={[styles.chance, className].filter(Boolean).join(" ")} aria-live="polite">
      {countdown > 0 ? (
        <>Kirim ulang dalam {mmss(countdown)}<br />(Sisa {chancesLeft} kesempatan)</>
      ) : (
        <>
          Tidak dapat Kode Verifikasi?{" "}
          <button type="button" className={styles.inlineAction} onClick={onResend} disabled={chancesLeft <= 0}>Kirim Ulang</button>
          <br />(Sisa {chancesLeft} kesempatan)
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Verification Code

export interface VerificationCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Where the code was sent. Decides the copy and the fallback action. */
  channel?: VerificationChannel;
  /** Masked phone number or e-mail, e.g. "08123****898". */
  destination: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called when every digit is entered. */
  onComplete?: (value: string) => void;
  length?: number;
  status?: VerificationStatus;
  /** Overrides the status message under the cells. */
  error?: string;
  /** Seconds until resend is allowed (see `useCountdown`). */
  countdown?: number;
  chancesLeft?: number;
  onResend?: () => void;
  /** SMS ↔ WhatsApp fallback ("Atau kirim via …"). */
  onSwitchChannel?: (to: VerificationChannel) => void;
  /** Email only: "Hubungi Customer Care". */
  onContactSupport?: () => void;
  title?: string;
  autoFocus?: boolean;
}

/** OTP entry: header, one-digit-per-cell input, status and resend info. Elyx: controls/verification-code.elyx, Figma set `Verification Code`. */
export function VerificationCode({
  channel = "sms", destination, value, defaultValue, onChange, onComplete, length = 6, status = "default", error,
  countdown = 120, chancesLeft = 2, onResend, onSwitchChannel, onContactSupport, title = "Masukkan Kode Verifikasi", autoFocus,
  className, ...rest
}: VerificationCodeProps) {
  const message = error ?? (status === "wrong" ? `Kode Verifikasi salah. ${chancesLeft} kesempatan tersisa` : status === "expired" ? "Kode Verifikasi Kedaluwarsa" : undefined);
  const other: VerificationChannel = channel === "whatsapp" ? "sms" : "whatsapp";
  const chance = <VerificationChanceInfo countdown={countdown} chancesLeft={chancesLeft} onResend={onResend} />;
  return (
    <div {...rest} className={[styles.verification, className].filter(Boolean).join(" ")}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          Kode Verifikasi telah dikirim via {CHANNEL_NAME[channel]} ke:
          <span className={styles.destination}>{destination}</span>
        </p>
      </div>
      <div className={styles.code}>
        <PinInput
          length={length}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onComplete={onComplete}
          error={!!message}
          label="Kode verifikasi"
          autoFocus={autoFocus}
        />
        {message && <p className={styles.message} role="alert">{message}</p>}
      </div>
      {channel === "email" ? (
        <>
          {chance}
          <button type="button" className={styles.support} onClick={onContactSupport}>Hubungi Customer Care</button>
        </>
      ) : (
        <div className={styles.footer}>
          {chance}
          <button type="button" className={styles.switch} onClick={() => onSwitchChannel?.(other)}>Atau kirim via {CHANNEL_NAME[other]}</button>
        </div>
      )}
    </div>
  );
}
