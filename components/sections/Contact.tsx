"use client";

import { useState } from "react";
import { useLocale } from "../LocaleProvider";
import { Reveal } from "../Reveal";
import { useConfig } from "../ConfigProvider";
import { site } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function Contact() {
  const { t, locale } = useLocale();
  const cfg = useConfig();
  const f = t.contact.form;

  const [subject, setSubject] = useState("billets");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const next: Errors = {};
    if (!data.name?.trim()) next.name = f.required;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(data.email ?? "")) next.email = f.invalidEmail;
    if ((data.message ?? "").trim().length < 10) next.message = f.tooShort;
    setErrors(next);
    if (Object.keys(next).length) return;

    setState("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section className="section" id="contact" data-heat="0.55">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="lead">{t.contact.lead}</p>
        </Reveal>

        {state === "sent" ? (
          <Reveal className="form-status" role="status">
            <h3>{f.successTitle}</h3>
            <p>{f.successBody}</p>
            <button className="btn btn-ghost" onClick={() => setState("idle")}>
              {f.again}
            </button>
          </Reveal>
        ) : (
          <Reveal>
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="field" data-error={!!errors.name}>
                <label htmlFor="name">
                  {f.name} <i>*</i>
                </label>
                <input id="name" name="name" autoComplete="name" required />
                {errors.name ? <span className="err">{errors.name}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="company">{f.company}</label>
                <input id="company" name="company" autoComplete="organization" />
              </div>

              <div className="field" data-error={!!errors.email}>
                <label htmlFor="email">
                  {f.email} <i>*</i>
                </label>
                <input id="email" name="email" type="email" autoComplete="email" required />
                {errors.email ? <span className="err">{errors.email}</span> : null}
              </div>

              <div className="field">
                <label htmlFor="phone">{f.phone}</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>

              <div className="field wide">
                <label htmlFor="subject">{f.subject}</label>
                <select
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  {f.subjects.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </select>
              </div>

              {subject === "billets" ? (
                <>
                  <div className="field">
                    <label htmlFor="alloy">{f.alloy}</label>
                    <select id="alloy" name="alloy" defaultValue={cfg.alloy} key={cfg.alloy}>
                      {site.alloys.map((a) => (
                        <option key={a} value={a}>
                          EN AW-{a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="quantity">{f.quantity}</label>
                    <input id="quantity" name="quantity" type="number" min="0" step="0.5" />
                  </div>

                  <div className="field">
                    <label htmlFor="diameter">{f.diameter}</label>
                    <select
                      id="diameter"
                      name="diameter"
                      defaultValue={String(cfg.diameter)}
                      key={cfg.diameter}
                    >
                      {site.diameters.map((d) => (
                        <option key={d} value={d}>
                          Ø{d} mm
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="length">{f.length}</label>
                    <select
                      id="length"
                      name="length"
                      defaultValue={String(cfg.length)}
                      key={cfg.length}
                    >
                      {site.lengths.map((l) => (
                        <option key={l} value={l}>
                          {l} mm
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : null}

              <div className="field wide" data-error={!!errors.message}>
                <label htmlFor="message">
                  {f.message} <i>*</i>
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={f.messagePlaceholder}
                  required
                />
                {errors.message ? <span className="err">{errors.message}</span> : null}
              </div>

              {/* bots fill this in; people never see it */}
              <div className="hp" aria-hidden>
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="form-foot">
                <button className="btn" type="submit" disabled={state === "sending"}>
                  {state === "sending" ? f.sending : f.submit}
                </button>
                {state === "error" ? (
                  <p className="err" style={{ color: "#ff8c7d" }}>
                    {f.errorTitle}. {f.errorBody}{" "}
                    <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>
                      {site.email}
                    </a>
                  </p>
                ) : (
                  <a
                    href={`mailto:${site.email}`}
                    className="mono-label"
                    style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}
                  >
                    {site.email}
                  </a>
                )}
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
