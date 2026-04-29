import { StatsCards } from "@/components/(dashboard)/stats-cards";
import { ProjectsTable } from "@/components/(dashboard)/projects-table";

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
] as const;

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Las tarjetas que hicimos antes */}
      <StatsCards
        metrics={{ activos: 2, pendientes: 15, completados: 8, atrasados: 1 }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <h3 className="text-xl font-semibold mb-4">Proyectos en curso</h3>
          <ProjectsTable proyectos={mockProyectos} />
        </div>

        {/* Aquí podrías poner el feed de notificaciones que planeamos */}
        <div className="col-span-3 border rounded-xl p-4 bg-slate-50/50">
          <h3 className="text-lg font-medium mb-4">Actividad Reciente</h3>
          <p className="text-sm text-muted-foreground italic">
            Próximamente: Logs de Supabase...
          </p>
        </div>
      </div>
    </div>
  );
}
