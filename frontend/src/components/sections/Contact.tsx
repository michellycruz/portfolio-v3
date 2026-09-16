import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Profile } from "../../types/content";
import { sendContactMessage } from "../../lib/api";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { SectionHeading } from "../ui/SectionHeading";
import { SocialIcon } from "../ui/SocialIcon";

const fieldClass =
  "w-full rounded-xl border-2 border-stroke bg-panel-2 px-3 py-2.5 text-[14.5px] text-ink placeholder:text-muted";

type Status = "idle" | "sending" | "success" | "error";

interface ContactProps {
  profile: Profile;
}

export function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");

  const campoNome = useRef<HTMLInputElement>(null);
  const campoEmail = useRef<HTMLInputElement>(null);
  const campoMensagem = useRef<HTMLTextAreaElement>(null);

  // Quando o servidor recusa um campo, o foco vai para ele. Sem isso a pessoa
  // fica olhando para o botao, com o problema escrito mais acima na tela -- e
  // quem usa leitor de tela nem fica sabendo que existe.
  useEffect(() => {
    if (status !== "error") return;
    if (errors.name) campoNome.current?.focus();
    else if (errors.email) campoEmail.current?.focus();
    else if (errors.message) campoMensagem.current?.focus();
  }, [status, errors]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setErrorMsg("");

    const result = await sendContactMessage(form);

    if (result.ok) {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      return;
    }

    setStatus("error");
    setErrors(result.errors ?? {});
    setErrorMsg(result.error ?? "Falha ao enviar mensagem.");
  }

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === "success" || status === "error") setStatus("idle");
  }

  return (
    <section id="contato" className="flex scroll-mt-24 flex-col gap-5">
      <SectionHeading title="Contato" kicker="Resposta rápida" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,1fr)]">
        <Card className="flex flex-col gap-4">
          <h3 className="text-[clamp(22px,3vw,28px)] leading-tight uppercase">
            Vamos falar sobre o seu projeto
          </h3>

          <form onSubmit={handleSubmit} aria-busy={status === "sending"} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">Nome</span>
              <input
                required
                ref={campoNome}
                name="nome"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "erro-nome" : undefined}
                className={fieldClass}
                placeholder="Como te chamo?"
              />
              {errors.name && (
                <span id="erro-nome" className="text-xs text-orange">
                  {errors.name}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">E-mail</span>
              <input
                required
                type="email"
                ref={campoEmail}
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "erro-email" : undefined}
                className={fieldClass}
                placeholder="voce@email.com"
              />
              {errors.email && (
                <span id="erro-email" className="text-xs text-orange">
                  {errors.email}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">Mensagem</span>
              <textarea
                required
                rows={4}
                ref={campoMensagem}
                name="mensagem"
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "erro-mensagem" : undefined}
                className={`${fieldClass} resize-y`}
                placeholder="Conta rapidamente o que você precisa."
              />
              {errors.message && (
                <span id="erro-mensagem" className="text-xs text-orange">
                  {errors.message}
                </span>
              )}
            </label>

            <Button type="submit" variant="primary" disabled={status === "sending"} className="self-start">
              {status === "sending" ? "Enviando…" : "Enviar mensagem"}
            </Button>

            {status === "success" && (
              <p role="status" className="font-mono text-xs text-mint">
                Mensagem enviada. Respondo assim que possível.
              </p>
            )}
            {status === "error" && errorMsg && (
              <p role="alert" className="font-mono text-xs text-orange">
                {errorMsg}
              </p>
            )}
          </form>
        </Card>

        <div className="flex flex-col gap-2.5">
          {profile.social.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 rounded-xl border-2 border-stroke bg-panel-2 px-3.5 py-3 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm"
              >
                <SocialIcon name={link.icon} className="h-[18px] w-[18px] shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">{link.name}</span>
                  <span className="block font-mono text-[11px] text-muted">
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                </span>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
