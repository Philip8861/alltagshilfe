import Image from "next/image";
import {
  getDemoAvatarGradient,
  getDemoAvatarInitials,
} from "@/lib/partner/partner-demo-avatars";

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

function DefaultUserIcon({ className }: { className: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68] ${className}`}
      aria-hidden
    >
      <svg width="55%" height="55%" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

type Props = {
  avatarUrl?: string | null;
  partnerCode?: string | null;
  displayName?: string | null;
  size?: PartnerAvatarSize;
  ring?: boolean;
  className?: string;
  alt?: string;
};

export function PartnerAvatar({
  avatarUrl,
  partnerCode,
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

  const initials = getDemoAvatarInitials(partnerCode, displayName);
  const hasLabel = Boolean(displayName?.trim() || partnerCode?.trim());

  if (!hasLabel) {
    return <DefaultUserIcon className={`${dim} ${ringCls} ${className}`.trim()} />;
  }

  const gradient = getDemoAvatarGradient(partnerCode);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold uppercase tracking-tight text-white shadow-[inset_0_-2px_6px_rgba(0,0,0,0.12)] ${gradient} ${dim} ${ringCls} ${className}`}
      aria-hidden={!alt}
      title={alt || undefined}
    >
      {initials}
    </div>
  );
}
