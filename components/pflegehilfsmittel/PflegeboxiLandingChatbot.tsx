"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PFLEGEBOXI_COLLAPSED_HINT,
  PFLEGEBOXI_PANEL_INTRO,
  PFLEGEBOXI_TOPICS,
  type PflegeboxiTopic,
} from "@/lib/pflegeboxi-topics";
import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";
import "./PflegeboxiLandingChatbot.css";

export function PflegeboxiLandingChatbot() {
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<PflegeboxiTopic | null>(null);
  const [jump, setJump] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const replyRef = useRef<HTMLDivElement>(null);
  const replyBubbleRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (expanded) {
      setSelectedTopic(null);
    }
  }, [expanded]);

  useEffect(() => {
    if (selectedTopic && replyRef.current) {
      replyRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedTopic]);

  /** Kurzes Aufleuchten der Sprechblase bei jedem neuen Inhalt (Intro oder Antwort). */
  useEffect(() => {
    if (!expanded) return;
    const el = replyBubbleRef.current;
    if (!el) return;
    el.classList.remove("ahs-landing-pfxb__reply-bubble--flash");
    void el.offsetWidth;
    el.classList.add("ahs-landing-pfxb__reply-bubble--flash");
    const t = window.setTimeout(() => {
      el.classList.remove("ahs-landing-pfxb__reply-bubble--flash");
    }, 700);
    return () => window.clearTimeout(t);
  }, [expanded, selectedTopic]);

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

  const onTopicClick = (topic: PflegeboxiTopic) => {
    setSelectedTopic(topic);
    triggerWiggle();
  };

  if (hidden) return null;

  return (
    <div
      className={`ahs-landing-pfxb__wrap${expanded ? " ahs-landing-pfxb__wrap--expanded" : ""}`}
      role="complementary"
      aria-label="Pflegeboxi Hilfe"
    >
      <button
        type="button"
        className="ahs-landing-pfxb__close"
        aria-label="Hilfe schließen"
        onClick={toggleExpanded}
      >
        ×
      </button>

      <div className="ahs-landing-pfxb__avatar">
        {!expanded ? (
          <div className="ahs-landing-pfxb__bubble-wrap">
            <button
              type="button"
              className="ahs-landing-pfxb__dismiss"
              aria-label="Pflegeboxi ausblenden"
              onClick={(e) => {
                e.stopPropagation();
                setHidden(true);
              }}
            >
              ×
            </button>
            <div className="ahs-landing-pfxb__bubble">{PFLEGEBOXI_COLLAPSED_HINT}</div>
          </div>
        ) : null}
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
      </div>

      <div className="ahs-landing-pfxb__window">
        <div ref={replyRef} className="ahs-landing-pfxb__reply-wrap">
          <div ref={replyBubbleRef} className="ahs-landing-pfxb__reply-bubble">
            {selectedTopic ? (
              <>
                <strong className="ahs-landing-pfxb__reply-q">{selectedTopic.label}</strong>
                <p className="ahs-landing-pfxb__reply-a">{selectedTopic.answer}</p>
                {selectedTopic.extraLinks?.length ? (
                  <div className="ahs-landing-pfxb__reply-links">
                    {selectedTopic.extraLinks.map((l) => (
                      <Link key={l.href + l.label} href={l.href} className="ahs-landing-pfxb__inline-link">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="ahs-landing-pfxb__reply-a">{PFLEGEBOXI_PANEL_INTRO}</p>
            )}
          </div>
        </div>

        <div className="ahs-landing-pfxb__topics" role="group" aria-label="Häufige Fragen">
          {PFLEGEBOXI_TOPICS.map((t) => (
            <button
              key={t.label}
              type="button"
              className="ahs-landing-pfxb__topic-btn"
              onClick={() => onTopicClick(t)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="ahs-landing-pfxb__panel-links" aria-label="Weitere Seiten">
          <Link href={PFLEGEBOX_KONFIGURATOR_PAGE} className="ahs-landing-pfxb__panel-link">
            Zum Konfigurator
          </Link>
          <Link href="/kontakt" className="ahs-landing-pfxb__panel-link">
            Kundenservice
          </Link>
          <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className="ahs-landing-pfxb__panel-link">
            Kostenfreie Pflegehilfsmittel
          </Link>
        </div>
      </div>
    </div>
  );
}
