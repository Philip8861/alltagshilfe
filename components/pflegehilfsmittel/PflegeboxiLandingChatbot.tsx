"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildPflegeboxiReply } from "@/lib/pflegeboxi-build-reply";
import "./PflegeboxiLandingChatbot.css";

const INTRO_BOT =
  "Hallo, ich bin Pflegeboxi. Ich bin kein freier KI-Chat, sondern antworte nach festen Regeln zu Stichworten – so bleibt alles nachvollziehbar. Nutz die Vorschläge unten oder schreib z. B. „Anspruch“, „42 Euro“, „Rezept“ oder „Konfigurator“.";

const BUBBLE_COLLAPSED =
  "Hallo, ich bin Pflegeboxi! Tipp auf mich – dann kannst du Stichwörter schicken oder Themen anklicken.";

const QUICK_TOPICS: { label: string; send: string }[] = [
  { label: "Steht mir das zu?", send: "Steht mir das zu?" },
  { label: "42 € Budget", send: "Wie funktioniert das 42 Euro Budget?" },
  { label: "Brauche ich ein Rezept?", send: "Brauche ich ein Rezept?" },
  { label: "Pflegeheim", send: "Was gilt im Pflegeheim?" },
  { label: "Konfigurator", send: "Wie finde ich den Konfigurator?" },
  { label: "Telefon", send: "Wie erreiche ich euch telefonisch?" },
];

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

  const sendUserMessage = useCallback(
    (raw: string) => {
      const value = raw.trim();
      if (!value) return;
      setMessages((m) => [...m, { from: "user", text: value }]);
      setInput("");
      const reply = buildPflegeboxiReply(value, { context: "landing" });
      window.setTimeout(() => {
        setMessages((m) => [...m, { from: "bot", text: reply }]);
        triggerWiggle();
      }, 300);
    },
    [triggerWiggle],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
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
        <div className="ahs-landing-pfxb__quick-topics" role="group" aria-label="Schnellthemen">
          {QUICK_TOPICS.map((t) => (
            <button
              key={t.label}
              type="button"
              className="ahs-landing-pfxb__quick-btn"
              onClick={() => sendUserMessage(t.send)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form className="ahs-landing-pfxb__form" autoComplete="off" onSubmit={onSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stichwort oder kurze Frage …"
            aria-label="Nachricht an Pflegeboxi"
          />
          <button type="submit">Senden</button>
        </form>
      </div>
    </div>
  );
}
