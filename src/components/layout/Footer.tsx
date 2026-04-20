import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Mail, Send, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Newsletter strip */}
        <div className="glass mb-14 flex flex-col items-center justify-between gap-6 rounded-2xl p-8 md:flex-row">
          <div>
            <h3 className="font-display text-2xl font-bold">
              Stay ahead of the curve.
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Monthly insights on web tech, design, and AI — no spam, ever.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md items-center gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 rounded-md border border-border bg-background/60 px-4 py-2.5 text-sm outline-none backdrop-blur focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)]"
            >
              Subscribe
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-gold)]">
                H
              </span>
              <span>
                HN<span className="text-primary">-GROUPE</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              A senior studio crafting websites, e-commerce stores, and custom platforms.
              We turn ambitious ideas into shipped products that move metrics.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Github, href: "#", label: "GitHub" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
              <li><Link to="/idea-generator" className="hover:text-foreground">AI Ideas</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/start-project" className="hover:text-foreground">Start a project</Link></li>
              <li><Link to="/auth" className="hover:text-foreground">Client login</Link></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <span>hello@hn-groupe.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>Remote · Casablanca · Paris</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} HN-GROUPE. Crafted with obsession.</span>
          <span className="text-gradient-gold font-display font-semibold">
            Built to last.
          </span>
        </div>
      </div>
    </footer>
  );
}
