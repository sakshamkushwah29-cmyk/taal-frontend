"use client";

import Link from "next/link";
import { Mail, MapPin, ArrowRight } from "lucide-react";

export default function AppFooter() {
  return (
    <footer className="bg-brand text-white mt-auto">
      <div className="container mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Column 1 - Brand */}
        <div>
          <h3 className="text-lg font-bold tracking-wide mb-3">taal.live</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Your one-stop shop for festive outfits, accessories, decor rentals,
            and event bookings. Celebrate every occasion in style.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/products", label: "Shop All" },
              { href: "/rentals", label: "Rentals" },
              { href: "/events", label: "Events" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Legal + Contact */}
        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
            Help
          </h3>
          <ul className="space-y-2.5 text-sm mb-6">
            {[
              { href: "/faqs", label: "FAQs" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms-of-use", label: "Terms of Use" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <Mail size={14} className="shrink-0" />
              <a href="mailto:taaleventss@gmail.com" className="hover:text-white transition-colors">
                taaleventss@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-2 text-white/70">
              <MapPin size={14} className="shrink-0 mt-0.5" />
              <span>Ujjain, Madhya Pradesh, India</span>
            </div>
          </div>
        </div>

        {/* Column 4 - Newsletter */}
        <div>
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-4">
            Stay in the Loop
          </h3>
          <p className="text-sm text-white/60 mb-4">
            Get exclusive deals, new arrivals, and festive offers delivered to
            your inbox.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2.5 bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-white text-brand text-sm font-semibold hover:bg-white/90 transition-colors flex items-center gap-1"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-white/10 py-5">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} taal.live &mdash; Shop, Rent &amp;
            Celebrate.
          </p>
          <p className="mt-2 sm:mt-0">
            Crafted with care for every Indian celebration
          </p>
        </div>
      </div>
    </footer>
  );
}
