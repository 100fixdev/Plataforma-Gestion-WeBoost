import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ProjectsTable } from "@/components/dashboard/projects-table";

// Datos de prueba ampliados
const mockProyectos = [
  {
    id_proyecto: "1",
    nombre: "Rediseño Web Hmil",
    cliente: "Hmil Nexus",
    estado: "activo",
    progreso: 65,
  },
  {
    id_proyecto: "2",
    nombre: "App Móvil Bancaria",
    cliente: "Lafise",
    estado: "activo",
    progreso: 40,
  },
  {
    id_proyecto: "3",
    nombre: "Consultoría IT",
    cliente: "MAQUINSA",
    estado: "en_pausa",
    progreso: 10,
  },
  {
    id_proyecto: "4",
    nombre: "Migración a la Nube",
    cliente: "TechCorp",
    estado: "finalizado",
    progreso: 100,
  },
] as const;

export default function ProyectosPage() {
  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground mt-2">
            Gestión y seguimiento de todos los proyectos de WeBoost Nic.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </div>

      {/* Barra de herramientas (Buscador y Filtros irán aquí) */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      <ProjectsTable proyectos={mockProyectos} />
    </div>
  );
}
