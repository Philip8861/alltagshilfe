"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./PflegeboxiLandingChatbot.css";

const INTRO_BOT =
  "Hallo, ich bin Pflegeboxi. Ich helfe dir bei deiner Auswahl sehr gerne weiter. Wie kann ich dir helfen?";

const BUBBLE_COLLAPSED =
  "Hallo, ich bin Pflegeboxi! Drück auf mich, ich helfe dir gerne weiter";

function buildReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("budget") || lower.includes("42")) {
    return "Für die Pflegebox stehen dir 42,00 € pro Monat zur Verfügung. Du kannst im Konfigurator Produkte so wählen, bis das Budget ausgeschöpft ist.";
  }
  if (lower.includes("handschuh")) {
    return "Bei Handschuhen kannst du Material wie Latex, Vinyl oder Nitril und Größen wie S, M, L oder XL wählen, damit sie optimal passen.";
  }
  if (lower.includes("pflegegrad") || lower.includes("anspruch")) {
    return "Kostenfreie Pflegehilfsmittel stehen ab Pflegegrad 1 zu – wir unterstützen dich bei der Beantragung bei deiner Pflegekasse.";
  }
  if (lower.includes("antrag") || lower.includes("beantrag")) {
    return "Du stellst deine Wunschbox im Konfigurator zusammen, trägst deine Daten ein und unterschreibst digital – wir kümmern uns um den Rest mit der Pflegekasse.";
  }
  if (lower.includes("pflegebox")) {
    return "Eine Pflegebox enthält monatlich benötigte Pflegehilfsmittel, die von der Pflegekasse übernommen werden können – wir helfen dir bei der passenden Zusammenstellung.";
  }
  if (lower.includes("kostenlos") || lower.includes("kostenfrei")) {
    return "Die Pflegehilfsmittel aus dem Hilfsmittelverzeichnis sind für dich zuzahlungsfrei, wenn du einen Anspruch bei der Pflegekasse hast – bis zu 42 € pro Monat für Verbrauchsmittel.";
  }
  return "Ich bin Pflegeboxi 🤍 und helfe dir bei Fragen zu Pflegeboxen und Pflegehilfsmitteln. Frag mich zu Budget, Antrag, Pflegegrad oder zum Konfigurator – oder nutze unsere Kontaktseite für persönliche Rückfragen.";
}

export function PflegeboxiLandingChatbot() {
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: INTRO_BOT },
  ]);
  const [input, setInput] = useState("");
  const [jump, setJump] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, expanded]);

  const triggerJump = useCallback(() => {
    setJump(false);
    void imgRef.current?.offsetWidth;
    setJump(true);
  }, []);

  const triggerWiggle = useCallback(() => {
    setWiggle(false);
    void imgRef.current?.offsetWidth;
    setWiggle(true);
  }, []);

  const onImgClick = () => {
    if (expanded) {
      triggerJump();
    } else {
      setExpanded(true);
    }
  };

  const toggleExpanded = () => setExpanded((e) => !e);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setInput("");
    const reply = buildReply(value);
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      triggerWiggle();
    }, 300);
  };

  if (hidden) return null;

  return (
    <div
      className={`ahs-landing-pfxb__wrap${expanded ? " ahs-landing-pfxb__wrap--expanded" : ""}`}
      role="complementary"
      aria-label="Pflegeboxi Hilfe-Chat"
    >
      <button
        type="button"
        className="ahs-landing-pfxb__close"
        aria-label="Chat schließen"
        onClick={toggleExpanded}
      >
        ×
      </button>

      <div className="ahs-landing-pfxb__avatar">
        {/* eslint-disable-next-line @next/next/no-img-element -- Fallback .png wie im Konfigurator */}
        <img
          ref={imgRef}
          src="/konfigurator/images/pflegeboxi.webp"
          alt="Pflegeboxi"
          className={`ahs-landing-pfxb__img${jump ? " ahs-landing-pfxb__img--jump" : ""}${wiggle ? " ahs-landing-pfxb__img--wiggle" : ""}`}
          width={130}
          height={130}
          decoding="async"
          onClick={onImgClick}
          onAnimationEnd={(ev) => {
            if (ev.animationName.includes("ahs-landing-pfxb-jump")) setJump(false);
            if (ev.animationName.includes("ahs-landing-pfxb-wiggle")) setWiggle(false);
          }}
          onError={(ev) => {
            const t = ev.currentTarget;
            if (t.src.includes("pflegeboxi.webp")) {
              t.src = "/konfigurator/images/pflegeboxi_freude.webp";
              return;
            }
            if (t.src.includes("pflegeboxi_freude")) {
              t.src = "/konfigurator/images/pflegeboxi.png";
            }
          }}
        />
        {!expanded ? <div className="ahs-landing-pfxb__bubble">{BUBBLE_COLLAPSED}</div> : null}
      </div>

      <button
        type="button"
        className="ahs-landing-pfxb__hide-mobile"
        aria-label="Pflegeboxi ausblenden"
        onClick={(e) => {
          e.stopPropagation();
          setHidden(true);
        }}
      >
        ×
      </button>

      <div className="ahs-landing-pfxb__window">
        <div ref={messagesRef} className="ahs-landing-pfxb__messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ahs-landing-pfxb__msg ahs-landing-pfxb__msg--${msg.from}`}>
              <span className="ahs-landing-pfxb__bubble-text">{msg.text}</span>
            </div>
          ))}
        </div>
        <form className="ahs-landing-pfxb__form" autoComplete="off" onSubmit={onSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nachricht an die Box eingeben..."
            aria-label="Nachricht an Pflegeboxi"
          />
          <button type="submit">Senden</button>
        </form>
      </div>
    </div>
  );
}
