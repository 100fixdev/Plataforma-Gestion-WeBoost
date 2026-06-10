import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase-server";
import { TakeTaskButton } from "@/components/dashboard/take-task-button";

function getPriorityBadgeClass(prioridad: string) {
  switch (prioridad) {
    case "Urgente":
    case "Alta":
      return "bg-red-100 text-red-700 hover:bg-red-100 border-none";
    case "Media":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none";
    case "Baja":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none";
    default:
      return "bg-slate-200 text-slate-700 hover:bg-slate-200 border-none";
  }
}

export default async function TareasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <p>Debes iniciar sesión.</p>;

  const userId = user.id;

  // IDs de proyectos del usuario
  const { data: membresias } = await supabase
    .from("Proyecto_Miembro")
    .select("id_proyecto")
    .eq("id_usuario", userId);
  const proyectoIds = membresias?.map((m) => m.id_proyecto) ?? [];

  // Tareas de esos proyectos (asignadas al usuario o sin asignar)
  const { data: tareas } = await supabase
    .from("Tarea")
    .select(`
      *,
      Proyecto ( nombre ),
      Usuario!id_asignado ( nombre ),
      Sprint ( nombre )
    `)
    .in("id_proyecto", proyectoIds)
    .order("fecha_limite", { ascending: true });

  const misTareas = tareas?.filter((t) => t.id_asignado === userId) ?? [];
  const disponibles = tareas?.filter((t) => t.id_asignado === null) ?? [];

  const pendientes = misTareas.filter((t) => t.estado === "Pendiente");
  const enProgreso = misTareas.filter((t) => t.estado === "En progreso");
  const completadas = misTareas.filter((t) => t.estado === "Completada");
  const bloqueadas = misTareas.filter((t) => t.estado === "Bloqueada");

  const renderTaskCard = (tarea: any, isCompleted = false) => (
    <Card
      key={tarea.id_tarea}
      className={`cursor-pointer transition-colors ${isCompleted ? "opacity-75" : "hover:border-blue-300 shadow-sm"}`}
    >
      <CardContent className="p-4">
        {!isCompleted && tarea.prioridad && (
          <Badge className={`mb-2 ${getPriorityBadgeClass(tarea.prioridad)}`}>
            {tarea.prioridad}
          </Badge>
        )}
        <p className={`font-medium text-sm ${isCompleted ? "line-through text-slate-500" : ""}`}>
          {tarea.titulo}
        </p>
        {tarea.descripcion && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tarea.descripcion}</p>
        )}
        <p className="text-xs text-slate-500 mt-2">
          {tarea.Proyecto?.nombre ? `Proyecto: ${tarea.Proyecto.nombre}` : "Sin proyecto"}
        </p>
        {tarea.Usuario?.nombre && (
          <p className="text-xs text-slate-500 mt-1">Asignado a: {tarea.Usuario.nombre}</p>
        )}
        {tarea.Sprint?.nombre && (
          <p className="text-xs text-slate-500 mt-1">Sprint: {tarea.Sprint.nombre}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tareas del Sprint</h1>
          <p className="text-muted-foreground mt-2">
            Control de flujo de trabajo para el Sprint actual.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
        </Button>
      </div>

      {/* Tareas disponibles (sin asignar) */}
      {disponibles.length > 0 && (
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center justify-between">
            Tareas disponibles{" "}
            <Badge variant="outline" className="text-amber-700 border-amber-300">{disponibles.length}</Badge>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {disponibles.map((t) => (
              <Card key={t.id_tarea} className="hover:shadow-sm">
                <CardContent className="p-4">
                  <Badge className={`mb-2 ${getPriorityBadgeClass(t.prioridad)}`}>{t.prioridad}</Badge>
                  <p className="font-medium text-sm">{t.titulo}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.descripcion}</p>
                  <p className="text-xs text-slate-500 mt-2">Proyecto: {t.Proyecto?.nombre}</p>
                  <TakeTaskButton tareaId={t.id_tarea} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tablero Kanban - Mis tareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 items-start">
        <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200 min-h-[400px]">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
            Por Hacer <Badge variant="secondary">{pendientes.length}</Badge>
          </h3>
          <div className="space-y-3">
            {pendientes.map((t) => renderTaskCard(t))}
            {pendientes.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No hay tareas pendientes</p>}
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 min-h-[400px]">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center justify-between">
            En Progreso <Badge variant="default" className="bg-blue-600">{enProgreso.length}</Badge>
          </h3>
          <div className="space-y-3">
            {enProgreso.map((t) => renderTaskCard(t))}
            {enProgreso.length === 0 && <p className="text-sm text-blue-400/70 text-center py-4">No hay tareas en progreso</p>}
          </div>
        </div>

        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 min-h-[400px]">
          <h3 className="font-semibold text-red-900 mb-4 flex items-center justify-between">
            Bloqueadas <Badge variant="default" className="bg-red-600">{bloqueadas.length}</Badge>
          </h3>
          <div className="space-y-3">
            {bloqueadas.map((t) => renderTaskCard(t))}
            {bloqueadas.length === 0 && <p className="text-sm text-red-400/70 text-center py-4">No hay tareas bloqueadas</p>}
          </div>
        </div>

        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 min-h-[400px]">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center justify-between">
            Completadas <Badge variant="outline" className="text-green-700 border-green-300">{completadas.length}</Badge>
          </h3>
          <div className="space-y-3">
            {completadas.map((t) => renderTaskCard(t, true))}
            {completadas.length === 0 && <p className="text-sm text-green-600/50 text-center py-4">No hay tareas completadas</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
