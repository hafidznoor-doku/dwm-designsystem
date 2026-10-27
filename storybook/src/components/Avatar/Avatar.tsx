import type { HTMLAttributes } from "react";
import styles from "./Avatar.module.css";

export type AvatarGender = "male" | "female";

/** Default illustrations used when the user has no profile photo. */
const PLACEHOLDER: Record<AvatarGender, { src: string; cls: string }> = {
  male: { src: "resources/assets/images/fd6fba10aa466fb2.png", cls: styles.bitmap },
  female: { src: "resources/assets/icons/pp-ilustrasi-icon-02.svg", cls: styles.illustration },
};

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** User's profile photo. Without it the gender placeholder illustration is shown. */
  src?: string;
  /** Picks the placeholder illustration when there is no photo. */
  gender?: AvatarGender;
  /** Accessible name, usually the user's name. Omit when the name is shown next to the avatar. */
  alt?: string;
  /** Edge length in dp. The design uses 38. */
  size?: number;
}

/** Profile picture in a rounded square. Elyx: controls/avatar.elyx, Figma set `Avatar`. */
export function Avatar({ src, gender = "male", alt, size = 38, className, style, ...rest }: AvatarProps) {
  const placeholder = PLACEHOLDER[gender];
  return (
    <span
      {...rest}
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      className={[styles.avatar, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
    >
      <img className={src ? styles.photo : placeholder.cls} src={src ?? placeholder.src} alt="" draggable={false} />
    </span>
  );
}
