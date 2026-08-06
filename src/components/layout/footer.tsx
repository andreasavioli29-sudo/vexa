import Link from "next/link";

import { Logo } from "@/components/logo";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

const COLLECTION_LINKS = [
  { label: "ONE", href: "/one" },
  { label: "Signature", href: "/signature" },
  { label: "Accessories", href: "/accessories" },
];

const COMPANY_LINKS = [
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Journal", href: "/journal" },
  { label: "Careers", href: "/careers" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Warranty", href: "/warranty" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/10 bg-black">
      <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-6">
            <Logo wordmarkClassName="text-base" markClassName="h-4 w-4" />
            <p className="max-w-xs text-sm leading-relaxed text-anthracite-300">
              The Art of Sleeping. Precision-engineered sleep systems,
              designed to outlast the ordinary.
            </p>
            <div className="flex items-center gap-5 pt-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] uppercase tracking-[0.2em] text-anthracite-300 transition-colors hover:text-copper-300"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Collection" links={COLLECTION_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div className="flex flex-col gap-4">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-anthracite-400">
              Contact
            </h3>
            <a
              href="mailto:hello@vexa.com"
              className="text-sm text-anthracite-200 transition-colors hover:text-white"
            >
              hello@vexa.com
            </a>
            <span className="text-sm text-anthracite-300">
              Milano · New York
            </span>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-anthracite-400">
            &copy; {new Date().getFullYear()} VEXA. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-anthracite-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-anthracite-400">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-anthracite-200 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
