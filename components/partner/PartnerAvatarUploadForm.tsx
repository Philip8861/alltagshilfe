"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { PartnerAvatar } from "@/components/partner/PartnerAvatar";
import { PartnerAvatarCropModal } from "@/components/partner/PartnerAvatarCropModal";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import { removePartnerAvatarAction, uploadPartnerAvatarAction } from "@/lib/actions/partner-avatar";
import {
  isAllowedPartnerAvatarClientType,
  PARTNER_AVATAR_ACCEPT,
  PARTNER_AVATAR_MAX_BYTES,
} from "@/lib/partner/partner-avatar-shared";

type Props = {
  avatarUrl: string | null;
  partnerCode: string | null;
  displayName: string;
};

export function PartnerAvatarUploadForm({ avatarUrl: initialAvatarUrl, partnerCode, displayName }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const openFilePicker = () => {
    if (pending) return;
    inputRef.current?.click();
  };

  const onFileSelected = (file: File | null) => {
    if (!file || pending) return;
    setFeedback(null);

    if (!isAllowedPartnerAvatarClientType(file.type)) {
      setFeedback({ tone: "err", text: "Nur JPG-, JPEG- oder PNG-Dateien sind erlaubt." });
      return;
    }
    if (file.size > PARTNER_AVATAR_MAX_BYTES) {
      setFeedback({ tone: "err", text: "Die Datei darf maximal 500 KB groß sein." });
      return;
    }

    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
  };

  const closeCrop = () => {
    setCropOpen(false);
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadCropped = (file: File) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("avatar", file);
      const result = await uploadPartnerAvatarAction(fd);
      closeCrop();
      if (result.ok) {
        setAvatarUrl(result.avatarUrl);
        setFeedback({ tone: "ok", text: "Profilbild wurde gespeichert." });
        router.refresh();
        return;
      }
      setFeedback({ tone: "err", text: result.message });
    });
  };

  const removeAvatar = () => {
    if (pending) return;
    if (typeof window !== "undefined" && !window.confirm("Profilbild wirklich entfernen?")) return;
    startTransition(async () => {
      const result = await removePartnerAvatarAction();
      if (result.ok) {
        setAvatarUrl(null);
        setFeedback({ tone: "ok", text: "Profilbild wurde entfernt." });
        router.refresh();
        return;
      }
      setFeedback({ tone: "err", text: result.message });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <PartnerAvatar
          avatarUrl={avatarUrl}
          partnerCode={partnerCode}
          displayName={displayName}
          size="profile"
          ring
          alt={`Profilbild von ${displayName}`}
        />
        <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
          <p className="text-sm text-neutral-600">
            Ihr Bild erscheint in der Begrüßung, im Werbenetzwerk und in Team-Listen. Erlaubt sind JPG, JPEG und PNG
            (max. 500 KB). Nach dem Upload können Sie das Bild im Kreis zuschneiden.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              type="button"
              disabled={pending}
              onClick={openFilePicker}
              className="rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-50"
            >
              {avatarUrl ? "Neues Bild wählen" : "Bild hochladen"}
            </button>
            {avatarUrl ? (
              <button
                type="button"
                disabled={pending}
                onClick={removeAvatar}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
              >
                Entfernen
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={PARTNER_AVATAR_ACCEPT}
        className="sr-only"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />

      {feedback ? (
        <PartnerAuthStatusBox
          message={feedback.tone === "err" ? feedback.text : null}
          successHighlight={feedback.tone === "ok" ? feedback.text : null}
          pending={pending}
        />
      ) : pending ? (
        <PartnerAuthStatusBox message={null} pending />
      ) : null}

      {cropSrc ? (
        <PartnerAvatarCropModal
          open={cropOpen}
          imageSrc={cropSrc}
          onClose={closeCrop}
          onConfirm={uploadCropped}
          busy={pending}
        />
      ) : null}
    </div>
  );
}
