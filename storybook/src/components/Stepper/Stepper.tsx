import type { HTMLAttributes } from "react";
import styles from "./Stepper.module.css";

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Current step, 1-based. Steps up to and including it are filled. */
  current: number;
  /** Number of steps. */
  total?: number;
  /** What the user does on this step, shown under the counter. */
  subtitle?: string;
  /** Counter text. Defaults to "Langkah {current} dari {total}". */
  label?: string;
}

/** Horizontal step indicator for multi-step forms. Elyx: controls/stepper.elyx, Figma set `Stepper Horizontal`. */
export function Stepper({ current, total = 3, subtitle, label, className, ...rest }: StepperProps) {
  const steps = Math.max(1, total);
  const done = Math.min(Math.max(current, 0), steps);
  return (
    <div {...rest} className={[styles.stepper, className].filter(Boolean).join(" ")}>
      <div className={styles.heading}>
        <span className={styles.count}>{label ?? `Langkah ${done} dari ${steps}`}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-valuenow={done}
        aria-valuetext={label ?? `Langkah ${done} dari ${steps}`}
      >
        {Array.from({ length: steps }, (_, i) => (
          <span key={i} className={styles.segment} data-done={i < done || undefined} />
        ))}
      </div>
    </div>
  );
}
