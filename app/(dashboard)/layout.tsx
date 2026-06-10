import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let usuario = null;
  if (user) {
    const { data } = await supabase
      .from("Usuario")
      .select("nombre, rol")
      .eq("id_usuario", user.id)
      .single();
    usuario = data;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        userName={usuario?.nombre ?? user?.email ?? "Usuario"}
        userRole={usuario?.rol ?? ""}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
