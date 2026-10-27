import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cx, type FieldBaseProps, fieldStyles, Helper, helperOf, LabelRow, Line, useFieldIds } from "../InputForm/FieldParts";
import { DropdownList, type SelectOption } from "./DropdownList";
import styles from "./SelectForm.module.css";

export interface SelectFormProps extends FieldBaseProps {
  id?: string;
  /** Submitted with forms through a hidden input. */
  name?: string;
  options: SelectOption[];
  /** Selected value. Controlled when set (use null for none). */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string, option: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Open state. Controlled when set. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Forces the pressed (focused) look without opening the list, for documentation. */
  state?: "default" | "pressed";
}

const chevronMask = {
  maskImage: 'url("resources/assets/icons/right-icons-3.svg")',
  WebkitMaskImage: 'url("resources/assets/icons/right-icons-3.svg")',
};

/** DOKU select: an underline field that opens a dropdown list. Elyx: controls/select-form.elyx, Figma set `Select Form`. */
export function SelectForm({
  label, helperText, error, info, onInfoClick, className, style, id, name, options, value, defaultValue = null, onChange,
  placeholder = "Pilih", disabled, required, open, defaultOpen = false, onOpenChange, state = "default",
}: SelectFormProps) {
  const ids = useFieldIds(id);
  const rootRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [active, setActive] = useState<string | null>(null);
  const selected = value !== undefined ? value : innerValue;
  const isOpen = !disabled && (open ?? innerOpen);
  const current = options.find((o) => o.value === selected);
  const helper = helperOf(helperText, error);
  const enabled = options.filter((o) => !o.disabled);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
    if (next) setActive(current && !current.disabled ? current.value : enabled[0]?.value ?? null);
  };
  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    if (value === undefined) setInnerValue(o.value);
    onChange?.(o.value, o);
    setOpen(false);
  };

  // Close on outside press.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  const move = (step: number) => {
    if (!enabled.length) return;
    const i = enabled.findIndex((o) => o.value === active);
    const next = i < 0 ? (step > 0 ? 0 : enabled.length - 1) : (i + step + enabled.length) % enabled.length;
    setActive(enabled[next].value);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(1),
      ArrowUp: () => move(-1),
      Home: () => setActive(enabled[0]?.value ?? null),
      End: () => setActive(enabled.at(-1)?.value ?? null),
      Enter: () => { const o = options.find((x) => x.value === active); if (o) choose(o); },
      " ": () => { const o = options.find((x) => x.value === active); if (o) choose(o); },
      Escape: () => setOpen(false),
    };
    if (e.key === "Tab") return setOpen(false);
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };
  const optionId = (v: string) => `${ids.list}-${v.replace(/[^\w-]/g, "_")}`;

  return (
    <div
      ref={rootRef}
      className={cx(fieldStyles.field, styles.select, className)}
      style={style}
      data-state={state}
      data-open={isOpen ? "" : undefined}
      data-invalid={error ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
    >
      <div className={fieldStyles.container}>
        <LabelRow label={label} htmlFor={ids.input} labelId={ids.label} info={info} onInfoClick={onInfoClick} disabled={disabled} />
        <button
          type="button"
          id={ids.input}
          className={styles.trigger}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? ids.list : undefined}
          aria-labelledby={`${ids.label} ${ids.input}`}
          aria-activedescendant={isOpen && active ? optionId(active) : undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={helper ? ids.helper : undefined}
          disabled={disabled}
          onClick={() => setOpen(!isOpen)}
          onKeyDown={onKeyDown}
        >
          <span className={styles.valueText} data-placeholder={current ? undefined : ""}>{current?.label ?? placeholder}</span>
          <span className={styles.chevron} style={chevronMask} aria-hidden />
        </button>
      </div>
      <Line />
      <Helper id={ids.helper} text={helper} className={cx(fieldStyles.helper, styles.helperFill)} />
      {name && <input type="hidden" name={name} value={selected ?? ""} />}
      {isOpen && (
        <div className={styles.popup}>
          <DropdownList id={ids.list} options={options} value={selected} activeValue={active} onSelect={choose} optionId={optionId}
            aria-labelledby={ids.label} />
        </div>
      )}
    </div>
  );
}
