"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, CheckSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils"; // Utilidad que instaló shadcn

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Proyectos", href: "/proyectos", icon: Briefcase },
  { name: "Tareas", href: "/tareas", icon: CheckSquare },
  { name: "Clientes", href: "/clientes", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white h-screen sticky top-0 flex flex-col">
      {/* Logo o Título de la Plataforma */}
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          WeBoost<span className="text-blue-600">Nic</span>
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-700" : "text-slate-400",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sección inferior (Perfil o Ajustes) */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
            FR
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">
              Felix Ramírez
            </span>
            <span className="text-xs text-slate-500">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
