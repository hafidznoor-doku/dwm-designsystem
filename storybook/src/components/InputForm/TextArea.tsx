import { useState, type ChangeEvent, type TextareaHTMLAttributes } from "react";
import { Counter, cx, describedBy, type FieldBaseProps, fieldStyles as styles, Helper, helperOf, LabelRow, Line, useFieldIds } from "./FieldParts";
import type { FieldState } from "./TextField";

export interface TextAreaProps extends FieldBaseProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style" | "className"> {
  /** Shows the "n/max" counter (default on when `maxLength` is set, as in the design). */
  showCounter?: boolean;
  /** Forces the focused look for documentation. */
  state?: FieldState;
}

/** DOKU multi-line note field (3 visible lines). Elyx: controls/input-form.elyx, Figma set `Input Area`. */
export function TextArea({
  label, helperText, error, info, onInfoClick, className, style, showCounter = true, state = "default",
  id, value, defaultValue, onChange, disabled, maxLength, ...rest
}: TextAreaProps) {
  const ids = useFieldIds(id);
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : inner;
  const helper = helperOf(helperText, error);
  const counter = showCounter && maxLength !== undefined;
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInner(e.target.value);
    onChange?.(e);
  };
  return (
    <div
      className={cx(styles.field, styles.area, className)}
      style={style}
      data-state={state}
      data-invalid={error ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <div className={styles.container}>
        <LabelRow label={label} htmlFor={ids.input} labelId={ids.label} info={info} onInfoClick={onInfoClick} disabled={disabled} />
        <div className={styles.areaBox}>
          <textarea
            {...rest}
            id={ids.input}
            className={styles.textarea}
            value={current}
            onChange={handleChange}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(counter && ids.counter, helper && ids.helper)}
          />
        </div>
      </div>
      <Line />
      {counter && <Counter id={ids.counter} length={current.length} max={maxLength!} />}
      <Helper id={ids.helper} text={helper} />
    </div>
  );
}
