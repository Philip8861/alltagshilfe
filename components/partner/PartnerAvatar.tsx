import Image from "next/image";

export type PartnerAvatarSize = "sm" | "md" | "lg" | "xl" | "profile";

const SIZE_CLASS: Record<PartnerAvatarSize, string> = {
  sm: "h-9 w-9 text-[0.7rem]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-14 w-14 text-base",
  profile: "h-16 w-16 text-base sm:h-20 sm:w-20 sm:text-lg",
};

const IMAGE_SIZES: Record<PartnerAvatarSize, string> = {
  sm: "36px",
  md: "40px",
  lg: "48px",
  xl: "56px",
  profile: "80px",
};

/**
 * Platzhalter ohne Profilbild: Person-Silhouette im Markenstil (helle Fläche, Teal-Figur).
 * Bewusst kein Initialen-/Farbverlauf-Fallback mehr: Tailwind-Klassen aus `lib/` wurden nicht
 * generiert und ergaben einen leeren weißen Kreis.
 */
function DefaultUserIcon({
  className,
  label,
}: {
  className: string;
  label?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E3F1F5] text-[#0F4F68] ${className}`}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      title={label || undefined}
    >
      <svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" aria-hidden>
        {/* Kopf */}
        <circle cx="32" cy="25" r="11" fill="currentColor" fillOpacity="0.9" />
        {/* Schultern – unten vom Kreis beschnitten */}
        <path
          d="M12 60c0-11.6 9-20 20-20s20 8.4 20 20v6H12v-6z"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
}

type Props = {
  avatarUrl?: string | null;
  /** Nur noch für Aufrufer-Kompatibilität; Darstellung ohne Bild ist immer das Personen-Icon. */
  partnerCode?: string | null;
  displayName?: string | null;
  size?: PartnerAvatarSize;
  ring?: boolean;
  className?: string;
  alt?: string;
};

export function PartnerAvatar({
  avatarUrl,
  displayName,
  size = "md",
  ring = false,
  className = "",
  alt = "",
}: Props) {
  const dim = SIZE_CLASS[size];
  const ringCls = ring ? "ring-2 ring-[#3DB8C9]/35 ring-offset-2 ring-offset-white" : "";
  const wrapCls = `relative shrink-0 overflow-hidden rounded-full ${dim} ${ringCls} ${className}`.trim();

  if (avatarUrl?.trim()) {
    return (
      <div className={wrapCls}>
        <Image
          src={avatarUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes={IMAGE_SIZES[size]}
          unoptimized
        />
      </div>
    );
  }

  void displayName;
  return <DefaultUserIcon className={`${dim} ${ringCls} ${className}`.trim()} label={alt || undefined} />;
}
