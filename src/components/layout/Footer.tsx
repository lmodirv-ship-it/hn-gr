import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-[image:var(--gradient-gold)] text-primary-foreground">
              H
            </span>
            <span>
              HN<span className="text-primary">-groupe</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            HN-groupe is a software & web solutions studio. We design and build websites,
            e-commerce stores, and custom platforms that help businesses grow.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/portfolio" className="hover:text-foreground">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/start-project" className="hover:text-foreground">
                Start a project
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>hello@hn-groupe.com</span>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="#"
              aria-label="Twitter"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} HN-groupe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
