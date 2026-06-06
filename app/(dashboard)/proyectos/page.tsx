import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { supabase } from "@/lib/supabase";

export default async function ProyectosPage() {
  // 1. Consulta a la base de datos de Supabase
  // Seleccionamos los campos de la tabla `Proyecto` y la relación con `Cliente`
  // Asegúrate de escribir "Proyecto" exactamente como en la DB
  const { data: proyectos, error } = await supabase
    .from("Proyecto")
    .select(
      `
    id_proyecto, 
    nombre, 
    descripcion, 
    estado, 
    fecha_inicio, 
    fecha_fin, 
    Cliente!FK_id_cliente ( nombre )
  `,
    ) // Usamos !FK_id_cliente si llega a fallar la detección automática
    .order("id_proyecto", { ascending: false });

  console.log("=== DEBUG SUPABASE ===");
  console.log("¿Hay error?:", error);
  console.log("Datos crudos de la DB:", proyectos);
  console.log("======================");

  if (error) {
    console.error("Error al obtener proyectos:", error.message);
  }

  // 2. Formatear los datos para que coincidan con lo que espera tu componente ProjectsTable
  // 2. Formatear los datos para que coincidan con lo que espera ProjectsTable
  // Calculamos `progreso` como el % de tiempo transcurrido entre fecha_inicio y fecha_fin
  const proyectosFormateados =
    proyectos?.map((proy: any) => {
      const id = proy.id_proyecto?.toString() ?? "";
      const nombre = proy.nombre ?? "Sin nombre";
      const cliente =
        (proy.Cliente?.nombre || proy.cliente?.nombre) ?? "Sin asignar";
      const estado = proy.estado ?? "en_pausa";

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
      } catch (e) {
        progreso = 0;
      }

      return {
        id_proyecto: id,
        nombre,
        descripcion: proy.descripcion ?? "",
        cliente,
        estado,
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
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

      {/* 3. Pasamos los datos reales a la tabla */}
      <ProjectsTable proyectos={proyectosFormateados} />
    </div>
  );
}
