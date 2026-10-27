import type { HTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import { Keyboard, type KeyboardKey } from "../Keyboard/Keyboard";
import { VerificationCode, type VerificationCodeProps } from "./VerificationCode";
import styles from "./VerificationScreen.module.css";

export interface VerificationScreenProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Props for the verification code block. */
  code: VerificationCodeProps;
  title?: string;
  onBack?: () => void;
  /** Shows the mock Android number keyboard; its keys type into the code. */
  keyboard?: boolean;
}

/**
 * Full verification-code screen: status bar, app bar, code block and number keyboard.
 * Elyx: controls/verification-code.elyx, private Figma set `_template-verif-code`.
 */
export function VerificationScreen({ code, title = "Kode Verifikasi", onBack, keyboard = true, className, ...rest }: VerificationScreenProps) {
  const length = code.length ?? 6;
  const value = code.value ?? "";
  const onKey = (k: KeyboardKey) => {
    const next = k === "backspace" ? value.slice(0, -1) : /^\d$/.test(k) && value.length < length ? value + k : value;
    if (next === value) return;
    code.onChange?.(next);
    if (next.length === length) code.onComplete?.(next);
  };
  return (
    <div {...rest} className={[styles.screen, className].filter(Boolean).join(" ")}>
      <img className={styles.statusBar} src="resources/assets/icons/status-bar-ios.svg" alt="" />
      <header className={styles.appBar}>
        <button type="button" className={styles.back} aria-label="Kembali" onClick={onBack}>
          <Icon name="arrow-back-round" size={20} tint="var(--elyx-colors-neutral-80)" />
        </button>
        <h1 className={styles.appTitle}>{title}</h1>
      </header>
      <main className={styles.body}>
        <VerificationCode {...code} />
      </main>
      {keyboard && <Keyboard layout="android" className={styles.keyboard} style={{ width: "100%" }} onKey={onKey} />}
    </div>
  );
}
