"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  Tag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/facilitadores", label: "Facilitadores", icon: Users },
  { href: "/admin/actividades", label: "Actividades", icon: Activity },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-72px)]">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-warmblack text-white p-3 rounded-full shadow-large"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-warmblack/30 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-56 bg-warmblack text-cream-500/60 flex-shrink-0 flex flex-col transition-transform duration-500 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-full bg-sage-600 flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.5 5.5-6 7" />
                <path d="M11.7 10.9c.9-1 1.8-1.7 3.3-2.4" />
                <path d="M11 20v-8" />
              </svg>
            </div>
            <span className="font-serif font-semibold text-cream-100 text-sm">
              Admin
            </span>
          </div>

          <nav className="space-y-0.5">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-cream-500/60 hover:text-cream-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-white/5">
          <a
            href="/admin/logout"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-cream-500/40 hover:text-cream-200 hover:bg-white/5 transition-all duration-300"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Cerrar Sesión
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-cream-500/40 hover:text-cream-200 hover:bg-white/5 transition-all duration-300 mt-0.5"
          >
            Ver sitio público
          </a>
        </div>
      </aside>

      <div className="flex-1 bg-cream-100 p-6 sm:p-8 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
