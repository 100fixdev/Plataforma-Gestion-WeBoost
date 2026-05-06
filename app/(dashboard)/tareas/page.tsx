import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TareasPage() {
  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tareas del Sprint
          </h1>
          <p className="text-muted-foreground mt-2">
            Control de flujo de trabajo para el Sprint actual.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
        </Button>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        {/* Columna: Pendientes */}
        <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200 min-h-[500px]">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
            Por Hacer <Badge variant="secondary">2</Badge>
          </h3>
          <div className="space-y-3">
            <Card className="cursor-pointer hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-slate-200 text-slate-700 hover:bg-slate-200">
                  Alta Prioridad
                </Badge>
                <p className="font-medium text-sm">Configurar UTM Fortinet</p>
                <p className="text-xs text-slate-500 mt-2">
                  Proyecto: Consultoría IT
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-slate-200 text-slate-700 hover:bg-slate-200">
                  Media
                </Badge>
                <p className="font-medium text-sm">
                  Diseño de logo vectorial H y N
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Proyecto: Rediseño Web Hmil
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Columna: En Progreso */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 min-h-[500px]">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center justify-between">
            En Progreso{" "}
            <Badge variant="default" className="bg-blue-600">
              1
            </Badge>
          </h3>
          <div className="space-y-3">
            <Card className="cursor-pointer border-blue-200 shadow-sm">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-red-100 text-red-700 hover:bg-red-100 border-none">
                  Urgente
                </Badge>
                <p className="font-medium text-sm">
                  Migración de Base de Datos
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Asignado a: Felix Ramírez
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Columna: Completadas */}
        <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 min-h-[500px]">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center justify-between">
            Completadas{" "}
            <Badge
              variant="outline"
              className="text-green-700 border-green-300"
            >
              1
            </Badge>
          </h3>
          <div className="space-y-3">
            <Card className="opacity-75">
              <CardContent className="p-4">
                <p className="font-medium text-sm line-through text-slate-500">
                  Crear repositorio base Next.js
                </p>
                <p className="text-xs text-slate-400 mt-2">Completado hoy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
