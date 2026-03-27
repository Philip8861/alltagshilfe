"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (
      domain: string,
      options: {
        roomName: string;
        parentNode: HTMLElement;
        userInfo?: { displayName?: string };
        configOverwrite?: Record<string, unknown>;
        interfaceConfigOverwrite?: Record<string, unknown>;
      },
    ) => {
      dispose: () => void;
    };
  }
}

const JITSI_DOMAIN = "meet.jit.si";

function sanitizeRoomCode(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 40);
}

function createRoomCode() {
  return `AHS-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36).slice(-4)}`.toUpperCase();
}

export function OnlineVideoberatungClient() {
  const searchParams = useSearchParams();
  const queryRoom = sanitizeRoomCode(searchParams.get("room") ?? "");
  const [roomCode, setRoomCode] = useState(queryRoom);
  const [displayName, setDisplayName] = useState("");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<HTMLDivElement | null>(null);
  const jitsiRef = useRef<{ dispose: () => void } | null>(null);

  const inviteLink = useMemo(() => {
    if (!roomCode || typeof window === "undefined") return "";
    return `${window.location.origin}/pflegeberatung/online-videoberatung?room=${encodeURIComponent(roomCode)}`;
  }, [roomCode]);

  useEffect(() => {
    setRoomCode(queryRoom);
  }, [queryRoom]);

  useEffect(() => {
    return () => {
      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (jitsiRef.current) jitsiRef.current.dispose();
    };
  }, []);

  const ensureScript = async () => {
    if (window.JitsiMeetExternalAPI) return;
    await new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("jitsi-api-script") as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Jitsi konnte nicht geladen werden.")), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.id = "jitsi-api-script";
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Jitsi konnte nicht geladen werden."));
      document.body.appendChild(script);
    });
  };

  const createInviteLink = async () => {
    const newCode = createRoomCode();
    setRoomCode(newCode);
    setError("");
    const link = `${window.location.origin}/pflegeberatung/online-videoberatung?room=${encodeURIComponent(newCode)}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard might be blocked; still show link in UI.
    }
  };

  const activateMedia = async () => {
    setError("");
    if (!roomCode) {
      setError("Bitte zuerst einen Gesprächscode erstellen oder eingeben.");
      return;
    }
    if (!displayName.trim()) {
      setError("Bitte Ihren Namen eingeben.");
      return;
    }
    if (!identityConfirmed) {
      setError("Bitte bestätigen Sie, dass Sie die richtige Person sind.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      previewStreamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        await previewRef.current.play();
      }
      setMediaReady(true);
    } catch {
      setError("Kamera oder Mikrofon konnte nicht aktiviert werden. Bitte Browser-Berechtigung prüfen.");
    }
  };

  const startCall = async () => {
    if (!callRef.current) return;
    setError("");
    setJoining(true);
    try {
      await ensureScript();
      if (!window.JitsiMeetExternalAPI) throw new Error("Video-API nicht verfügbar.");

      if (previewStreamRef.current) {
        previewStreamRef.current.getTracks().forEach((track) => track.stop());
        previewStreamRef.current = null;
      }

      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName: roomCode,
        parentNode: callRef.current,
        userInfo: { displayName: displayName.trim() },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          enableNoisyMicDetection: true,
        },
      });
      jitsiRef.current = api;
      setJoined(true);
    } catch {
      setError("Der Video-Call konnte nicht gestartet werden. Bitte erneut versuchen.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-[#0F4F68] sm:text-2xl">Online Videoberatung</h2>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Für eine sichere 1:1-Beratung: Einladungslink erstellen, Person bestätigen, Kamera & Ton aktivieren und direkt starten.
        </p>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-4">
            <p className="text-sm font-semibold text-[#0F4F68]">1) Gesprächscode / Einladungslink</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={createInviteLink}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52]"
              >
                Einladungslink automatisch erstellen
              </button>
              {inviteLink ? (
                <a
                  href={inviteLink}
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                >
                  Link öffnen
                </a>
              ) : null}
            </div>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(sanitizeRoomCode(e.target.value))}
              placeholder="Gesprächscode"
              className="mt-3 w-full rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-sm outline-none focus:border-[#0F4F68]/45"
            />
            {inviteLink ? (
              <p className="mt-2 break-all text-xs text-neutral-600">{inviteLink}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-4">
            <p className="text-sm font-semibold text-[#0F4F68]">2) Name & Bestätigung</p>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ihr Name"
              className="mt-3 w-full rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-sm outline-none focus:border-[#0F4F68]/45"
            />
            <label className="mt-3 flex items-start gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={identityConfirmed}
                onChange={(e) => setIdentityConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#F78F2E]"
              />
              <span>Ich bestätige, dass ich die richtige Person für dieses Gespräch bin.</span>
            </label>
          </div>

          <div className="rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-4">
            <p className="text-sm font-semibold text-[#0F4F68]">3) Kamera & Ton aktivieren</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={activateMedia}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e67e22]"
              >
                Kamera und Ton anmachen
              </button>
              <button
                type="button"
                onClick={startCall}
                disabled={!mediaReady || joining || joined}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {joining ? "Startet..." : joined ? "Gespräch läuft" : "Gespräch starten"}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/15 bg-white p-4 shadow-sm">
        <div ref={callRef} className={`w-full overflow-hidden rounded-xl ${joined ? "min-h-[420px]" : "hidden"}`} />
        {!joined ? (
          <div>
            <p className="text-sm font-semibold text-[#0F4F68]">Vorschau (Ihr Bild)</p>
            <video ref={previewRef} autoPlay muted playsInline className="mt-3 aspect-video w-full rounded-xl bg-[#0f4f68]/10 object-cover" />
            <p className="mt-2 text-xs text-neutral-600">Nach dem Start können genau zwei Personen im selben Code-Raum sprechen.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

