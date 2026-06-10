import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <p>Debes iniciar sesión.</p>;

  const userId = user.id;

  // IDs de proyectos donde el usuario es miembro
  const { data: membresias } = await supabase
    .from("Proyecto_Miembro")
    .select("id_proyecto")
    .eq("id_usuario", userId);
  const proyectoIds = membresias?.map((m) => m.id_proyecto) ?? [];

  const [
    { data: proyectos },
    { count: pendientes },
    { count: completadas },
    { count: atrasadas },
    { count: activos },
    { data: notificaciones },
  ] = await Promise.all([
    supabase
      .from("Proyecto")
      .select(`
        id_proyecto, nombre, estado, fecha_inicio, fecha_fin,
        Cliente ( nombre, empresa )
      `)
      .in("id_proyecto", proyectoIds)
      .order("id_proyecto", { ascending: false })
      .limit(5),
    supabase.from("Tarea").select("*", { count: "exact", head: true }).eq("id_asignado", userId).eq("estado", "Pendiente"),
    supabase.from("Tarea").select("*", { count: "exact", head: true }).eq("id_asignado", userId).eq("estado", "Completada"),
    supabase.from("Tarea").select("*", { count: "exact", head: true }).eq("id_asignado", userId).lt("fecha_limite", new Date().toISOString()).not("estado", "eq", "Completada"),
    supabase.from("Proyecto").select("*", { count: "exact", head: true }).in("id_proyecto", proyectoIds).eq("estado", "Activo"),
    supabase.from("Notificacion").select("id_notificacion, mensaje, tipo, leida, fecha").eq("id_usuario", userId).eq("leida", false).order("fecha", { ascending: false }).limit(10),
  ]);

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
      cliente: proy.Cliente?.empresa ?? proy.Cliente?.nombre ?? "Sin asignar",
      estado: proy.estado ?? "Planificación",
      progreso,
    };
  }) || [];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <StatsCards
        metrics={{
          activos: activos ?? 0,
          pendientes: pendientes ?? 0,
          completados: completadas ?? 0,
          atrasados: atrasadas ?? 0,
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <h3 className="text-xl font-semibold mb-4">Proyectos en curso</h3>
          <ProjectsTable proyectos={proyectosFormateados} />
        </div>

        <div className="col-span-3 border rounded-xl p-4 bg-slate-50/50">
          <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
          {notificaciones && notificaciones.length > 0 ? (
            <div className="space-y-3">
              {notificaciones.map((notif) => (
                <div key={notif.id_notificacion} className="flex items-start gap-3 text-sm p-3 bg-white rounded-lg border border-slate-100">
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.tipo === "urgente" ? "bg-red-500" : "bg-blue-500"}`} />
                  <div>
                    <p className="text-slate-700">{notif.mensaje}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(notif.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No hay notificaciones pendientes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
