import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FAQSection() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t("faq.eyebrow")}</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{t("faq.title.before")} <span className="text-gradient-gold">{t("faq.title.highlight")}</span>.</h2>
      </div>
      <div className="mt-12 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={"glass overflow-hidden rounded-xl transition-all duration-300 " + (isOpen ? "border-primary/40" : "")}>
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start">
                <span className="font-display text-base font-semibold sm:text-lg">{t(`faq.${i}.q`)}</span>
                <Plus className={"h-5 w-5 shrink-0 text-primary transition-transform duration-300 " + (isOpen ? "rotate-45" : "")} />
              </button>
              <div className={"grid transition-all duration-300 " + (isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{t(`faq.${i}.a`)}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
