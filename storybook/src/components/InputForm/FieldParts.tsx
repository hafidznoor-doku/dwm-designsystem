// Shared anatomy of the DOKU underline fields (label row, underline, counter,
// helper). Internal to InputForm and SelectForm.
import { useId, type CSSProperties, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./InputForm.module.css";

export { styles as fieldStyles };

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Common props of every labelled field. */
export interface FieldBaseProps {
  label: string;
  /** Helper text under the field. Replaced by the error message when `error` is a string. */
  helperText?: string;
  /** Invalid state. A string is shown as the helper text. */
  error?: boolean | string;
  /** Shows the info icon after the label. */
  info?: boolean;
  /** Makes the info icon a button. */
  onInfoClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function useFieldIds(id?: string) {
  const auto = useId();
  const base = id ?? `f${auto.replace(/[^a-zA-Z0-9]/g, "")}`;
  return { input: base, label: `${base}-label`, helper: `${base}-helper`, counter: `${base}-counter`, list: `${base}-list` };
}

export function helperOf(helperText?: string, error?: boolean | string) {
  return typeof error === "string" ? error : helperText;
}

export function LabelRow({ label, htmlFor, labelId, info, onInfoClick, disabled, children }: {
  label: string; htmlFor?: string; labelId: string; info?: boolean; onInfoClick?: () => void; disabled?: boolean; children?: ReactNode;
}) {
  const icon = <Icon name="info-outlined" size={12} tint="var(--info)" />;
  return (
    <div className={styles.labelRow}>
      <label className={styles.label} htmlFor={htmlFor} id={labelId}>{label}</label>
      {(info || onInfoClick) &&
        (onInfoClick ? (
          <button type="button" className={styles.iconButton} onClick={onInfoClick} disabled={disabled} aria-label={`Info ${label}`}>{icon}</button>
        ) : icon)}
      {children}
    </div>
  );
}

export const Line = () => <div className={styles.line} aria-hidden />;

export function Counter({ id, length, max }: { id: string; length: number; max: number }) {
  return <div className={styles.counter} id={id} aria-live="polite">{`${length}/${max}`}</div>;
}

export function Helper({ id, text, className }: { id: string; text?: string; className?: string }) {
  return text ? <p className={className ?? styles.helper} id={id}>{text}</p> : null;
}

/** aria-describedby from the parts that are present. */
export const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

/** Tinted 16dp half of right-icons.svg (clear or contacts glyph). */
export const splitIconStyle: CSSProperties = {
  maskImage: 'url("resources/assets/icons/right-icons-2.svg")',
  WebkitMaskImage: 'url("resources/assets/icons/right-icons-2.svg")',
};
