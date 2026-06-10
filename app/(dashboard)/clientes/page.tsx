import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, User } from "lucide-react";
import { createClient } from "@/lib/supabase-server";

export default async function ClientesPage() {
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

  // IDs de clientes asociados a esos proyectos
  const { data: proyectos } = await supabase
    .from("Proyecto")
    .select("id_cliente")
    .in("id_proyecto", proyectoIds);
  const clienteIds = [...new Set(proyectos?.map((p) => p.id_cliente) ?? [])];

  const { data: clientes } = await supabase
    .from("Cliente")
    .select(`
      id_cliente, nombre, empresa, contacto, email, telefono,
      Usuario ( nombre, email )
    `)
    .in("id_cliente", clienteIds)
    .order("empresa", { ascending: true });

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Clientes asociados a tus proyectos activos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientes?.map((cliente) => (
          <Card key={cliente.id_cliente} className="hover:shadow-md transition-shadow">
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
              {cliente.contacto && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Contacto: {cliente.contacto}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{cliente.email}</span>
              </div>
              {cliente.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{cliente.telefono}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {(!clientes || clientes.length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No hay clientes vinculados a tus proyectos.
          </div>
        )}
      </div>
    </div>
  );
}
