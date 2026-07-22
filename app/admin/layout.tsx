"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, Tag, Leaf, LogOut } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/facilitadores", label: "Facilitadores", icon: Users },
  { href: "/admin/actividades", label: "Actividades", icon: Activity },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className="w-56 bg-gray-900 text-gray-400 flex-shrink-0 flex flex-col">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="h-4 w-4 text-white" />
            <span className="font-bold text-white text-sm">Admin</span>
          </div>

          <nav className="space-y-0.5">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-white text-gray-900" : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-gray-800">
          <a
            href="/admin/logout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mt-1"
          >
            Ver sitio público
          </a>
        </div>
      </aside>

      <div className="flex-1 bg-gray-50 p-6">{children}</div>
    </div>
  );
}
