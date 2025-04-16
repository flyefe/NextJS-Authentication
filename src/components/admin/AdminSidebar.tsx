import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Admin Settings" },
  { href: "/admin/audit", label: "Audit Logs" },
  { href: "/admin/countries", label: "Countries" },
  { href: "/admin/routes", label: "Routes" },
  { href: "/admin/shipments", label: "Shipments" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 min-h-screen">
      <div className="mb-8">
        <span className="text-2xl font-bold text-blue-900 tracking-tight">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${pathname.startsWith(link.href) ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
