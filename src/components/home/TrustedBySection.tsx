import { useTranslation } from "react-i18next";

const logos = ["ATELIER NORD", "LOGITRACK", "VERDANT", "NEXLIO", "MAISON ORA", "PIXEL FORGE", "SEABRIDGE", "ARC STUDIO"];

export function TrustedBySection() {
  const { t } = useTranslation();

  return (
    <section className="relative border-y border-border/40 bg-background/40 py-10 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t("trusted.title")}
        </p>
      </div>
      <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 px-8">
          {[...logos, ...logos].map((logo, i) => (
            <span key={`${logo}-${i}`} className="font-display text-lg font-bold tracking-[0.2em] text-muted-foreground/60 transition-colors hover:text-primary">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
