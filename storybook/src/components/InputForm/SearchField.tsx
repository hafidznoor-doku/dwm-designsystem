import { type InputHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import { cx, describedBy, type FieldBaseProps, fieldStyles as styles, Helper, helperOf, LabelRow, useFieldIds } from "./FieldParts";
import type { FieldState } from "./TextField";

export interface SearchFieldProps extends FieldBaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "style" | "className"> {
  /** Small status badge after the label (hidden in the design by default). */
  badge?: string;
  /** Icon before the value (file name in resources/assets/icons). */
  iconStart?: string;
  /** Called when the search icon is tapped. Omit to keep the icon decorative. */
  onSearch?: (value: string) => void;
  /** Forces the focused look for documentation. */
  state?: FieldState;
}

/** DOKU boxed search field. Elyx: controls/input-form.elyx, Figma set `Input Form` (variants=search). */
export function SearchField({
  label, helperText, error, info, onInfoClick, className, style, badge, iconStart, onSearch, state = "default", id, disabled, type = "search", ...rest
}: SearchFieldProps) {
  const ids = useFieldIds(id);
  const helper = helperOf(helperText, error);
  const icon = <Icon name="icon-font-awesome-free-brands-s-sistrix" size={16} tint="var(--icon)" />;
  return (
    <div
      className={cx(styles.search, className)}
      style={style}
      data-state={state}
      data-invalid={error ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <LabelRow label={label} htmlFor={ids.input} labelId={ids.label} info={info} onInfoClick={onInfoClick} disabled={disabled}>
        {badge && <span className={styles.badge}><span className={styles.badgeText}>{badge}</span></span>}
      </LabelRow>
      <div className={styles.box}>
        {iconStart && <Icon name={iconStart} size={16} tint="var(--icon)" />}
        <input
          {...rest}
          id={ids.input}
          type={type}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(helper && ids.helper)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch?.(e.currentTarget.value);
            rest.onKeyDown?.(e);
          }}
        />
        {onSearch ? (
          <button type="button" className={styles.iconButton} disabled={disabled} aria-label="Cari"
            onClick={() => onSearch((document.getElementById(ids.input) as HTMLInputElement | null)?.value ?? "")}
            onMouseDown={(e) => e.preventDefault()}>
            {icon}
          </button>
        ) : icon}
      </div>
      <Helper id={ids.helper} text={helper} className={styles.searchHelper} />
    </div>
  );
}
