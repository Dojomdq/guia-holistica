import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-[13px] text-bark-500">
        <li>
          <Link href="/" className="hover:text-bark-700 transition-colors" aria-label="Inicio">
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            {item.href ? (
              <Link href={item.href} className="hover:text-bark-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-bark-800 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
