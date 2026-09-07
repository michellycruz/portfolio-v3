import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Send } from "lucide-react";
import { Panel, PanelBody, PanelTitle } from "../ui/Panel";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";
import { CURRENT_SITE_LABEL, CURRENT_SITE_URL } from "../../lib/site";

/** Só dois estados agora: o formulário não envia mais nada daqui. Ele existe
 *  porque faz parte do desenho desta versão, e enviar leva à versão atual. */
type Status = "idle" | "moved";

const inputClasses =
  "w-full rounded-lg border-2 border-ink bg-white px-4 py-3 font-body text-ink outline-none transition-shadow focus:shadow-brutal-sm dark:border-white/60 dark:bg-white/95";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  // Não há mais para onde enviar: esta versão é estática. Em vez do erro de
  // conexão que aparecia aqui — "não foi possível conectar ao servidor", que não
  // diz a ninguém o que fazer a seguir —, o envio explica onde o formulário
  // funciona de verdade.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("moved");
  }

  function updateField<K extends keyof typeof form>(field: K, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (status === "moved") setStatus("idle");
  }

  return (
    <section id="contato" className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading>Vamos conversar?</SectionHeading>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <Panel noShadowOnHover>
          <PanelTitle accent="mint">Envie uma mensagem</PanelTitle>
          <PanelBody>
            {/* O aviso vem antes dos campos de propósito: descobrir que a
                mensagem não vai a lugar nenhum só depois de escrevê-la seria
                pior do que o erro que estava aqui. */}
            <p className="mb-5 text-sm text-ink/70 dark:text-white/70">
              O envio de mensagens funciona na versão atual do portfólio.{" "}
              <a
                href={CURRENT_SITE_URL}
                className="font-semibold text-ink underline decoration-coral decoration-2 underline-offset-2 dark:text-white"
              >
                Ir para {CURRENT_SITE_LABEL}
              </a>
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                  Nome
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={inputClasses}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClasses}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  className={`${inputClasses} min-h-32 resize-y`}
                  placeholder="Como posso ajudar?"
                  required
                />
              </div>

              <Button type="submit" variant="coral" className="self-start">
                Enviar mensagem <Send size={16} />
              </Button>

              <AnimatePresence mode="wait">
                {status === "moved" && (
                  <motion.div
                    key="moved"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                    className="flex flex-col gap-3 rounded-lg border-2 border-ink bg-mint px-4 py-3 text-sm font-medium text-ink shadow-brutal-sm"
                  >
                    <span>
                      Esta é a versão anterior do portfólio, e ela não envia mensagens. Para falar
                      comigo, use o formulário da versão atual — ou os links de contato no rodapé.
                    </span>
                    <a
                      href={CURRENT_SITE_URL}
                      className="inline-flex w-fit items-center gap-1.5 rounded-lg border-2 border-ink bg-white px-3 py-1.5 font-semibold shadow-brutal-sm transition-transform hover:-translate-y-0.5"
                    >
                      Ir para {CURRENT_SITE_LABEL}
                      <ArrowUpRight size={15} />
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </PanelBody>
        </Panel>
      </motion.div>
    </section>
  );
}
