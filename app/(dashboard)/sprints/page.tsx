import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase-server";

function getEstadoBadgeClass(estado: string) {
  switch (estado) {
    case "Activo":
      return "bg-green-100 text-green-700 border-green-200";
    case "Completado":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

export default async function SprintsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <p>Debes iniciar sesión.</p>;

  const userId = user.id;

  const { data: membresias } = await supabase
    .from("Proyecto_Miembro")
    .select("id_proyecto")
    .eq("id_usuario", userId);
  const proyectoIds = membresias?.map((m) => m.id_proyecto) ?? [];

  const { data: sprints } = await supabase
    .from("Sprint")
    .select(`
      *,
      Proyecto ( nombre )
    `)
    .in("id_proyecto", proyectoIds)
    .order("fecha_inicio", { ascending: false });

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
          <p className="text-muted-foreground mt-2">
            Planificación y seguimiento de iteraciones de desarrollo.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Sprint
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sprints?.map((sprint) => {
          const hoy = new Date();
          const fin = new Date(sprint.fecha_fin);
          const daysLeft = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
          const isOverdue = sprint.estado === "Activo" && hoy > fin;

          return (
            <Card key={sprint.id_sprint} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{sprint.nombre}</CardTitle>
                  <Badge className={getEstadoBadgeClass(sprint.estado)}>{sprint.estado}</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Proyecto: {sprint.Proyecto?.nombre ?? "Sin proyecto"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(sprint.fecha_inicio)} - {formatDate(sprint.fecha_fin)}</span>
                </div>
                {sprint.estado === "Activo" && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-amber-500"}`} />
                    <span className={isOverdue ? "text-red-600 font-medium" : "text-amber-600 font-medium"}>
                      {isOverdue ? `Vencido hace ${Math.abs(daysLeft)} días` : daysLeft > 0 ? `${daysLeft} días restantes` : "Finaliza hoy"}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t flex items-center justify-end">
                  <Button variant="outline" size="sm">
                    <ArrowRight className="mr-1 h-4 w-4" /> Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {(!sprints || sprints.length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No hay sprints registrados para tus proyectos.
          </div>
        )}
      </div>
    </div>
  );
}
