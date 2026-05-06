import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Mail, Phone } from "lucide-react";

const mockClientes = [
  {
    id: 1,
    nombre: "José Carlos Urbina",
    empresa: "MAQUINSA",
    email: "jurbina@maquinsa.com",
    telefono: "+505 8888-0000",
  },
  {
    id: 2,
    nombre: "Angel Blandon",
    empresa: "TechCorp",
    email: "ablandon@techcorp.com",
    telefono: "+505 8888-1111",
  },
  {
    id: 3,
    nombre: "Dr. Roberto",
    empresa: "Hmil Nexus",
    email: "contacto@hmil.com",
    telefono: "+505 8888-2222",
  },
];

export default function ClientesPage() {
  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Directorio de clientes y empresas asociadas.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Añadir Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockClientes.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{cliente.empresa}</CardTitle>
                <p className="text-sm text-slate-500">{cliente.nombre}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{cliente.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{cliente.telefono}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
