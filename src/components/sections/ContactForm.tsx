"use client";

import { useId, useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

const NEEDS: readonly { label: string; hint: string; icon: IconName }[] = [
  { label: "Help using the app", hint: "Setting up, inviting contacts, starting a journey", icon: "help" },
  { label: "Report a problem", hint: "Something is not working as it should", icon: "flag" },
  { label: "Partnership or press", hint: "Work with us or write about Arrivo", icon: "users" },
  { label: "Feedback or an idea", hint: "Tell us what would make trips calmer", icon: "heart" },
  { label: "Something else", hint: "We will point you the right way", icon: "mail" },
];

const DEVICES = ["iPhone", "Android phone", "I have not installed it yet"] as const;
const STEPS = ["What you need", "A few details", "Your reply address"] as const;

function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/**
 * Three short steps that end in a ready-to-send email. Nothing is sent from this page: the visitor opens the
 * message in their own mail app, or copies it.
 */
export function ContactForm() {
  const base = useId();
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canNext = step === 0 ? needs.length > 0 : step === 1 ? message.trim().length > 0 : emailOk;

  const subject = `Arrivo: ${needs.join(", ") || "Hello"}`;
  const body = [
    message.trim(),
    "",
    devices.length ? `Device: ${devices.join(", ")}` : "",
    name.trim() ? `Name: ${name.trim()}` : "",
    `Reply to: ${email.trim()}`,
  ]
    .filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""))
    .join("\n");
  const mailto = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (canNext) setPrepared(true);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`To: ${siteConfig.supportEmail}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const field = "w-full rounded-2xl bg-background px-4 py-3 text-foreground shadow-press outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-highlight";

  return (
    <form onSubmit={submit} noValidate className="rounded-[28px] bg-background p-6 shadow-raise sm:p-8">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">Tell us how we can help</h2>
        <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {STEPS.map((label, index) => (
            <li key={label} aria-current={index === step ? "step" : undefined} className={`flex items-center gap-2 ${index === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              <b className={`inline-flex size-6 items-center justify-center rounded-full font-mono text-xs ${index <= step ? "bg-primary text-primary-foreground" : "bg-background shadow-press"}`}>{index + 1}</b>
              {label}
            </li>
          ))}
        </ol>
        <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full shadow-press">
          <i className="block h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {prepared ? (
        <div role="status" aria-live="polite" className="grid gap-4">
          <p className="font-semibold">Your message is ready.</p>
          <pre className="whitespace-pre-wrap rounded-2xl bg-background p-4 font-sans text-sm text-muted-foreground shadow-press">{`To: ${siteConfig.supportEmail}\nSubject: ${subject}\n\n${body}`}</pre>
          <div className="flex flex-wrap gap-3">
            <Button href={mailto} arrow>
              Open in your email app
            </Button>
            <Button variant="soft" onClick={() => void copy()}>
              {copied ? "Copied" : "Copy message"}
            </Button>
            <Button variant="soft" onClick={() => setPrepared(false)}>
              Edit
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Nothing has been sent yet. You send it from your own email app.</p>
        </div>
      ) : (
        <>
          {step === 0 ? (
            <fieldset className="grid gap-3">
              <legend className="mb-3 font-semibold">
                What do you need? <small className="font-normal text-muted-foreground">Pick one or more</small>
              </legend>
              {NEEDS.map((need, index) => {
                const id = `${base}-need-${index}`;
                const checked = needs.includes(need.label);
                return (
                  <div key={need.label}>
                    <input id={id} type="checkbox" checked={checked} onChange={() => setNeeds(toggle(needs, need.label))} className="peer sr-only" />
                    <label
                      htmlFor={id}
                      className="flex cursor-pointer items-center gap-4 rounded-2xl bg-background px-4 py-3 shadow-soft transition-shadow hover:shadow-raise peer-checked:shadow-press peer-focus-visible:ring-2 peer-focus-visible:ring-highlight"
                    >
                      <span className={`grid size-10 shrink-0 place-items-center rounded-full ${checked ? "bg-primary text-primary-foreground" : "text-highlight shadow-press"}`}>
                        <Icon name={checked ? "check" : need.icon} className="size-5" />
                      </span>
                      <span>
                        <b className="block">{need.label}</b>
                        <small className="text-muted-foreground">{need.hint}</small>
                      </span>
                    </label>
                  </div>
                );
              })}
            </fieldset>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5">
              <fieldset>
                <legend className="mb-3 font-semibold">
                  Which phone? <small className="font-normal text-muted-foreground">If it matters</small>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {DEVICES.map((device, index) => {
                    const id = `${base}-device-${index}`;
                    return (
                      <div key={device}>
                        <input id={id} type="checkbox" checked={devices.includes(device)} onChange={() => setDevices(toggle(devices, device))} className="peer sr-only" />
                        <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-background px-4 text-sm shadow-soft transition-shadow hover:shadow-raise peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-highlight">
                          {device}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <div>
                <label htmlFor={`${base}-message`} className="mb-2 block font-semibold">
                  What should we know?
                </label>
                <textarea
                  id={`${base}-message`}
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us what happened or what you have in mind."
                  className={field}
                />
                <p className="mt-2 text-sm text-muted-foreground">Please do not include exact addresses, coordinates or passwords.</p>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5">
              <div>
                <label htmlFor={`${base}-name`} className="mb-2 block font-semibold">
                  Your name <small className="font-normal text-muted-foreground">Optional</small>
                </label>
                <input id={`${base}-name`} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className={field} />
              </div>
              <div>
                <label htmlFor={`${base}-email`} className="mb-2 block font-semibold">
                  Email for our reply
                </label>
                <input
                  id={`${base}-email`}
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  aria-invalid={email.length > 0 && !emailOk}
                  className={field}
                />
                {email.length > 0 && !emailOk ? <p className="mt-2 text-sm text-muted-foreground">Please enter an email address like name@example.com.</p> : null}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {step > 0 ? (
              <Button variant="soft" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : null}
            {step < STEPS.length - 1 ? (
              <Button arrow disabled={!canNext} onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit" arrow disabled={!canNext}>
                Prepare my message
              </Button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
