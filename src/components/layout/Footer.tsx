import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { Linkedin, Mail, Send, MapPin, Phone, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DEFAULT_CONTACT, buildTelHref, buildWhatsAppUrl } from "@/lib/contact-links";

export function Footer() {
  const { t } = useTranslation();
  const phoneHref = buildTelHref(DEFAULT_CONTACT.phone);
  const whatsappHref = buildWhatsAppUrl(DEFAULT_CONTACT.whatsapp);
  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email) return;
    window.location.href = `mailto:${DEFAULT_CONTACT.email}?subject=${encodeURIComponent("Newsletter subscription")}&body=${encodeURIComponent(`Please subscribe this email: ${email}`)}`;
  };
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass mb-14 flex flex-col items-center justify-between gap-6 rounded-2xl p-8 md:flex-row">
          <div><h3 className="font-display text-2xl font-bold">{t("footer.newsletter.title")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("footer.newsletter.description")}</p></div>
          <form onSubmit={handleNewsletter} className="flex w-full max-w-md items-center gap-2">
            <input name="email" type="email" required placeholder={t("footer.newsletter.placeholder")} className="flex-1 rounded-md border border-border bg-background/60 px-4 py-2.5 text-sm outline-none backdrop-blur focus:border-primary" />
            <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]">{t("footer.newsletter.submit")}<Send className="h-4 w-4" /></button>
          </form>
        </div>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-display text-xl font-bold"><span className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]">H</span><span>HN<span className="text-primary">-GROUPE</span></span></div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">{t("footer.description")}</p>
            <div className="mt-5 flex items-center gap-3">{[{ Icon: MessageCircle, href: whatsappHref, label: "WhatsApp" }, { Icon: Linkedin, href: "https://www.linkedin.com/company/hn-groupe", label: "LinkedIn" }].map(({ Icon, href, label }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"><Icon className="h-4 w-4" /></a>)}</div>
          </div>
          <div className="md:col-span-2"><h4 className="text-sm font-semibold">{t("footer.services")}</h4><ul className="mt-4 space-y-2 text-sm text-muted-foreground"><li><Link to="/web-design" className="hover:text-foreground">{t("footer.webDesign")}</Link></li><li><Link to="/ecommerce" className="hover:text-foreground">{t("footer.ecommerce")}</Link></li><li><Link to="/saas" className="hover:text-foreground">{t("footer.saas")}</Link></li><li><Link to="/portfolio" className="hover:text-foreground">{t("footer.portfolio")}</Link></li></ul></div>
          <div className="md:col-span-2"><h4 className="text-sm font-semibold">{t("footer.company")}</h4><ul className="mt-4 space-y-2 text-sm text-muted-foreground"><li><Link to="/book-call" className="hover:text-foreground">{t("footer.bookCall")}</Link></li><li><Link to="/start-project" className="hover:text-foreground">{t("footer.startProject")}</Link></li><li><Link to="/idea-generator" className="hover:text-foreground">{t("footer.aiIdeas")}</Link></li><li><Link to="/auth" className="hover:text-foreground">{t("footer.clientLogin")}</Link></li></ul></div>
          <div className="md:col-span-3"><h4 className="text-sm font-semibold">{t("footer.contact")}</h4><ul className="mt-4 space-y-3 text-sm text-muted-foreground"><li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /><a href={`mailto:${DEFAULT_CONTACT.email}`} className="hover:text-primary">{DEFAULT_CONTACT.email}</a></li><li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" />{phoneHref ? <a href={phoneHref} className="hover:text-primary">{DEFAULT_CONTACT.phone}</a> : <span>{DEFAULT_CONTACT.phone}</span>}</li><li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>{t("footer.location")}</span></li></ul></div>
        </div>
      </div>
      <div className="border-t border-white/5"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8"><span>{t("footer.copyright", { year: new Date().getFullYear() })}</span><span className="text-gradient-gold font-display font-semibold">{t("footer.built")}</span></div></div>
    </footer>
  );
}
