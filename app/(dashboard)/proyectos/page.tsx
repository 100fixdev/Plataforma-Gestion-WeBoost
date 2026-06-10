import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { createClient } from "@/lib/supabase-server";

export default async function ProyectosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <p>Debes iniciar sesión.</p>;

  const userId = user.id;

  // Datos del usuario actual (rol, nombre)
  const { data: usuario } = await supabase
    .from("Usuario")
    .select("id_usuario, nombre, rol")
    .eq("id_usuario", userId)
    .single();

  const esAdmin = usuario?.rol === "admin";

  // IDs de proyectos donde el usuario es miembro
  const { data: membresias } = await supabase
    .from("Proyecto_Miembro")
    .select("id_proyecto")
    .eq("id_usuario", userId);

  const proyectoIds = membresias?.map((m) => m.id_proyecto) ?? [];

  const { data: proyectos, error } = await supabase
    .from("Proyecto")
    .select(`
      id_proyecto, nombre, descripcion, estado, fecha_inicio, fecha_fin,
      Cliente ( nombre, empresa )
    `)
    .in("id_proyecto", proyectoIds)
    .order("id_proyecto", { ascending: false });

  if (error) console.error("Error al obtener proyectos:", error.message);

  const proyectosFormateados = proyectos?.map((proy) => {
    let progreso = 0;
    try {
      if (proy.fecha_inicio && proy.fecha_fin) {
        const inicio = new Date(proy.fecha_inicio);
        const fin = new Date(proy.fecha_fin);
        const ahora = new Date();
        const total = fin.getTime() - inicio.getTime();
        const trans = ahora.getTime() - inicio.getTime();
        progreso = total > 0 ? Math.round((trans / total) * 100) : 0;
        if (progreso < 0) progreso = 0;
        if (progreso > 100) progreso = 100;
      }
    } catch { progreso = 0; }

    return {
      id_proyecto: proy.id_proyecto?.toString() ?? "",
      nombre: proy.nombre ?? "Sin nombre",
      descripcion: proy.descripcion ?? "",
      cliente: proy.Cliente?.empresa ?? proy.Cliente?.nombre ?? "Sin asignar",
      estado: proy.estado ?? "Planificación",
      progreso,
    };
  }) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground mt-2">
            Gestión y seguimiento de todos los proyectos de WeBoost Nic.
          </p>
        </div>
        {esAdmin && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Button>
        )}
      </div>

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

      <ProjectsTable proyectos={proyectosFormateados} />
    </div>
  );
}
