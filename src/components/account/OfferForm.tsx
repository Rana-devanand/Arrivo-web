"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, fieldClass } from "@/components/ui/Field";
import { Heading } from "@/components/ui/Heading";
import { Panel } from "@/components/ui/Panel";
import { useNow } from "@/components/watch/useNow";
import { normaliseCode, offerMinutes, offerWindow, parseAdminOffer, validateOffer, type OfferUnit } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import { AccountApiError, postJson } from "./accountApi";
import { OfferCard } from "./OfferCard";

const PRESETS: { label: string; amount: number; unit: OfferUnit }[] = [
  { label: "1 hour", amount: 1, unit: "hours" },
  { label: "1 day", amount: 1, unit: "days" },
  { label: "3 days", amount: 3, unit: "days" },
  { label: "7 days", amount: 7, unit: "days" },
  { label: "30 days", amount: 30, unit: "days" },
];

type Message = { kind: "ok" | "error"; text: string };

/**
 * Makes a discount offer: a name, a code, a percentage off the first payment, when it starts and how long it stays valid. Beside
 * it, the card exactly as people will see it. The server creates the matching discount in the payment partner's system.
 */
export function OfferForm({ onCreated }: { onCreated: () => void }) {
  const { getToken } = useAccount();
  const now = useNow();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("20");
  const [startMode, setStartMode] = useState<"now" | "later">("now");
  const [startLocal, setStartLocal] = useState("");
  const [amount, setAmount] = useState("24");
  const [unit, setUnit] = useState<OfferUnit>("hours");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const minutes = offerMinutes(Number(amount), unit);
  const startsAtMs = startMode === "later" ? new Date(startLocal).getTime() : null;
  const percentOff = Number(percent);
  const windowOk = now > 0 && Number.isFinite(minutes) && minutes > 0 && (startsAtMs === null || Number.isFinite(startsAtMs));
  const endsAt = windowOk ? offerWindow(now, startsAtMs, minutes).endsAt : new Date(now + 24 * 3_600_000).toISOString();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const when = Date.now();
    const problem = validateOffer({ title, code, percentOff, startsAtMs, minutes }, when);
    if (problem) {
      setMessage({ kind: "error", text: problem });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const made = await postJson(
        "/admin/coupons",
        await getToken(),
        { code, title: title.trim(), percentOff, ...offerWindow(when, startsAtMs, minutes) },
        parseAdminOffer,
      );
      setMessage({ kind: "ok", text: `Offer ${made.code} is ${made.status === "scheduled" ? "scheduled" : "live"}.` });
      setTitle("");
      setCode("");
      onCreated();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof AccountApiError ? error.message : "We could not make the offer. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel as="section" aria-labelledby="new-offer-title" className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <form onSubmit={submit} className="grid content-start gap-4" noValidate>
        <Heading level={2} size={6} id="new-offer-title" className="text-muted-foreground">
          New offer
        </Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name of the offer">
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} placeholder="Launch offer" className={`${fieldClass} w-full`} />
          </Field>
          <Field label="Code" hint="3 to 16 capital letters or digits.">
            <input value={code} onChange={(e) => setCode(normaliseCode(e.target.value))} placeholder="LAUNCH20" autoCapitalize="characters" spellCheck={false} className={`${fieldClass} w-full font-mono tracking-widest`} />
          </Field>
          <Field label="Discount (%)" hint="Off the first payment only. 1 to 90.">
            <input value={percent} onChange={(e) => setPercent(e.target.value)} inputMode="numeric" className={`${fieldClass} w-full`} />
          </Field>
          <fieldset className="grid content-start gap-1.5">
            <legend className="mb-1.5 text-xs font-semibold">Starts</legend>
            <div className="flex gap-2">
              {(["now", "later"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={startMode === mode}
                  onClick={() => setStartMode(mode)}
                  className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ${startMode === mode ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
                >
                  {mode === "now" ? "Right now" : "Pick a time"}
                </button>
              ))}
            </div>
            {startMode === "later" ? (
              <input type="datetime-local" aria-label="Start time" value={startLocal} onChange={(e) => setStartLocal(e.target.value)} className={`${fieldClass} mt-1.5 w-full`} />
            ) : null}
          </fieldset>
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-1 text-xs font-semibold">Valid for</legend>
          <div className="flex flex-wrap items-center gap-2">
            <input aria-label="How long" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" className={`${fieldClass} w-24`} />
            <select aria-label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as OfferUnit)} className={`${fieldClass} w-auto`}>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setAmount(String(p.amount));
                  setUnit(p.unit);
                }}
                className="inline-flex min-h-9 items-center rounded-full border border-border px-3 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">People see the offer only while it is valid. After that it disappears by itself.</p>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" disabled={busy}>
            {busy ? "Making the offer..." : "Make the offer"}
          </Button>
          <p role={message?.kind === "error" ? "alert" : "status"} aria-live="polite" className={`text-xs font-medium ${message?.kind === "error" ? "text-danger" : "text-success"}`}>
            {message?.text ?? ""}
          </p>
        </div>
      </form>

      <div className="grid content-start gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">What people will see</p>
        <OfferCard
          offer={{
            code: code || "YOURCODE",
            title: title.trim() || "Your offer",
            percentOff: Number.isInteger(percentOff) && percentOff >= 1 && percentOff <= 90 ? percentOff : 20,
            endsAt,
          }}
        />
      </div>
    </Panel>
  );
}
