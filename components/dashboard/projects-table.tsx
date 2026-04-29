import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Definimos la interfaz para los datos (puedes mover esto a un archivo de tipos después)
interface Proyecto {
  id_proyecto: string;
  nombre: string;
  cliente: string;
  estado: "activo" | "finalizado" | "en_pausa";
  progreso: number;
}

export function ProjectsTable({ proyectos }: { proyectos: Proyecto[] }) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nombre del Proyecto</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Progreso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proyectos.map((proy) => (
            <TableRow key={proy.id_proyecto}>
              <TableCell className="font-medium">{proy.nombre}</TableCell>
              <TableCell>{proy.cliente}</TableCell>
              <TableCell>
                <Badge
                  variant={proy.estado === "activo" ? "default" : "secondary"}
                >
                  {proy.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${proy.progreso}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {proy.progreso}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
