import type { CSSProperties } from "react";

export type FlagCountry = "indonesia" | "malaysia" | "singapore" | "unitedStates";

export const flagLabels: Record<FlagCountry, string> = {
  indonesia: "Indonesia",
  malaysia: "Malaysia",
  singapore: "Singapura",
  unitedStates: "Amerika Serikat",
};

export interface FlagProps {
  country: FlagCountry;
  size?: number;
  className?: string;
  /** Accessible name; omit when the flag sits next to a visible country name or code. */
  label?: string;
}

// Flag artwork as in the Figma `flag` set: a 16dp frame, the flag drawn 2dp from the top.
// Colors are the flags' own (off-palette by nature).
const files: Partial<Record<FlagCountry, { file: string; h: number }>> = {
  indonesia: { file: "flag-indonesia", h: 16 },
  singapore: { file: "flags-singapore-flag-on", h: 11.43 },
  unitedStates: { file: "flag-flags-property-25", h: 11.43 },
};

const RED = "#EC1C24", WHITE = "#E6E7E8";
// Malaysia is built from vector layers in the design (no single SVG asset); [x, y, fill, path].
const malaysia: [number, number, string, string][] = [
  [0.14, 11.75, RED, "M0.345 0.75L15.38 0.75C15.53 0.527 15.643 0.274 15.723 0L0 0C0.08 0.274 0.193 0.527 0.344 0.75"],
  [6.25, 3.5, WHITE, "M0 0.75L9.611 0.75C9.531 0.476 9.418 0.223 9.268 0L0 0L0 0.75Z"],
  [6.25, 4.25, RED, "M0 0.75L9.741 0.75C9.726 0.496 9.682 0.244 9.611 0L0 0L0 0.75Z"],
  [6.25, 5, WHITE, "M9.741 0L0 0L0 0.75L9.75 0.75L9.75 0.25C9.75 0.166 9.746 0.083 9.741 0Z"],
  [6.25, 5.75, RED, "M0 0L9.75 0L9.75 0.75L0 0.75Z"],
  [6.25, 6.5, WHITE, "M0 0L9.75 0L9.75 0.75L0 0.75Z"],
  [6.25, 7.25, RED, "M0 0L9.75 0L9.75 0.75L0 0.75Z"],
  [6.25, 8, WHITE, "M0 0L9.75 0L9.75 0.75L0 0.75Z"],
  [0, 8.75, RED, "M0 0L0 0.75L16 0.75L16 0L6.25 0L0 0Z"],
  [0, 9.5, WHITE, "M0 0L16 0L16 0.75L0 0.75Z"],
  [0, 10.25, RED, "M0 0.5C0 0.585 0.004 0.668 0.009 0.75L15.991 0.75C15.996 0.668 16 0.585 16 0.5L16 0L0 0L0 0.5Z"],
  [0.01, 11, WHITE, "M0.13 0.75L15.853 0.75C15.924 0.506 15.967 0.254 15.983 0L0 0C0.015 0.254 0.059 0.506 0.13 0.75Z"],
  [6.25, 2.5, RED, "M9.267 1C8.856 0.389 8.181 0 7.25 0L0 0L0 1L9.267 1Z"],
  [0.48, 12.5, WHITE, "M2.017 1L13.017 1C13.949 1 14.623 0.611 15.035 0L0 0C0.412 0.611 1.086 1 2.017 1Z"],
  [0, 2.5, "#2B3990", "M2.5 0C1.568 0 0.894 0.389 0.482 1C0.332 1.223 0.219 1.476 0.139 1.75C0.068 1.994 0.024 2.246 0.009 2.5C0.004 2.582 0 2.665 0 2.75L0 6.25L6.25 6.25L6.25 0L2.5 0"],
  [0.86, 4.25, "#F9CB38", "M2.847 2.404C2.517 2.92 1.829 3.244 1.108 3.035C0.43 2.836 -0.037 2.177 0.002 1.468C0.04 0.755 0.574 0.149 1.27 0.026C2.008 -0.106 2.6 0.29 2.853 0.703C2.553 0.409 2.204 0.276 1.797 0.323C1.477 0.359 1.209 0.504 1 0.748C0.591 1.224 0.606 1.939 1.034 2.389C1.278 2.647 1.58 2.781 1.937 2.784C2.292 2.787 2.594 2.653 2.847 2.404Z"],
  [3.43, 4.85, "#F9CB38", "M0.671 1.338C0.512 1.421 0.354 1.503 0.195 1.585C0.193 1.583 0.193 1.581 0.191 1.58C0.309 1.448 0.426 1.315 0.545 1.182C0.544 1.179 0.543 1.176 0.542 1.173C0.365 1.178 0.185 1.186 0.007 1.192C0.007 1.189 0.006 1.187 0.005 1.185C0.168 1.116 0.331 1.046 0.494 0.979C0.494 0.976 0.495 0.972 0.496 0.969L0 0.758C0.001 0.756 0.001 0.755 0.001 0.752C0.181 0.76 0.361 0.767 0.541 0.774C0.542 0.771 0.544 0.768 0.545 0.764L0.196 0.369C0.197 0.366 0.198 0.364 0.2 0.362C0.358 0.445 0.516 0.527 0.685 0.615L0.542 0.096C0.544 0.094 0.545 0.093 0.548 0.092C0.653 0.233 0.759 0.374 0.865 0.516L0.876 0.516C0.909 0.344 0.942 0.172 0.975 0L0.983 0C1.014 0.172 1.048 0.343 1.083 0.527L1.411 0.092L1.417 0.094C1.369 0.264 1.321 0.433 1.274 0.602C1.276 0.605 1.279 0.608 1.28 0.61C1.438 0.53 1.595 0.449 1.752 0.367C1.754 0.37 1.756 0.371 1.758 0.374C1.642 0.505 1.527 0.635 1.411 0.765C1.411 0.768 1.413 0.771 1.413 0.775C1.59 0.769 1.767 0.762 1.944 0.755C1.945 0.758 1.946 0.761 1.946 0.764C1.784 0.832 1.621 0.901 1.46 0.969C1.459 0.973 1.458 0.976 1.458 0.979C1.625 1.05 1.791 1.121 1.957 1.191L1.955 1.196C1.775 1.189 1.595 1.181 1.414 1.174C1.413 1.177 1.411 1.18 1.409 1.184C1.527 1.316 1.644 1.449 1.761 1.581C1.76 1.584 1.759 1.585 1.757 1.586L1.282 1.339L1.273 1.344C1.319 1.514 1.366 1.683 1.413 1.852C1.411 1.854 1.408 1.855 1.406 1.856L1.089 1.431C1.085 1.432 1.083 1.433 1.079 1.433C1.045 1.606 1.012 1.779 0.979 1.952C0.977 1.952 0.975 1.953 0.973 1.952C0.94 1.779 0.907 1.606 0.875 1.433L0.865 1.43L0.545 1.856C0.542 1.855 0.54 1.855 0.539 1.853C0.586 1.683 0.633 1.514 0.681 1.344L0.671 1.338Z"],
];

/** Country flag. Elyx: controls/input-form.elyx, Figma set `flag`. */
export function Flag({ country, size = 16, className, label }: FlagProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  if (country === "malaysia") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" className={className} style={{ display: "block", flexShrink: 0 }} {...a11y}>
        {malaysia.map(([x, y, fill, d], i) => <path key={i} d={d} fill={fill} transform={`translate(${x} ${y})`} />)}
      </svg>
    );
  }
  const f = files[country]!;
  const s = size / 16;
  const style: CSSProperties = {
    display: "block",
    flexShrink: 0,
    width: size,
    height: size,
    backgroundImage: `url("resources/assets/icons/${f.file}.svg")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${size}px ${f.h * s}px`,
    backgroundPosition: `0 ${f.h === 16 ? 0 : 2 * s}px`,
  };
  return <span className={className} style={style} {...a11y} />;
}
