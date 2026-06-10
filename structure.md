weboost-nic-next/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx          # Sidebar compartido
│       ├── page.tsx            # Dashboard con stats reales + feed notificaciones
│       ├── proyectos/page.tsx  # Lista proyectos con datos de Supabase
│       ├── sprints/page.tsx    # Kanban/lista de sprints por proyecto
│       ├── tareas/page.tsx     # Tablero Kanban con 4 columnas (Pendiente, En progreso, Bloqueada, Completada)
│       └── clientes/page.tsx   # Directorio clientes con datos de Supabase
├── components/
│   ├── ui/                     # shadcn/ui (button, card, badge, table, etc.)
│   └── dashboard/
│       ├── sidebar.tsx         # Navegación lateral
│       ├── stats-cards.tsx     # KPIs (activos, pendientes, completados, atrasados)
│       └── projects-table.tsx  # Tabla de proyectos con progreso
├── lib/
│   ├── supabase.ts            # Cliente Supabase (Server Component)
│   ├── supabase.types.ts      # Tipos del schema (Usuario, Cliente, Proyecto, Sprint, Tarea, etc.)
│   └── utils.ts               # Utilidad cn() de shadcn
├── public/                     # Assets estáticos
├── .env.local                  # NEXT_PUBLIC_SUPABASE_URL + KEY
├── package.json
├── next.config.ts
└── tsconfig.json

## Schema Supabase (7 tablas)

Usuario (id_usuario uuid FK→auth.users, nombre, email, rol, fecha_registro)
Cliente (id_cliente PK, nombre, empresa, contacto, email, telefono, id_usuario_fk FK→Usuario)
Proyecto (id_proyecto PK, nombre, descripción, fecha_inicio, fecha_fin, estado CHECK['Planificación'|'Activo'|'En Pausa'|'Completado'], id_cliente FK→Cliente)
Proyecto_Miembro (id_proyecto FK→Proyecto, id_usuario FK→Usuario) PK compuesta
Sprint (id_sprint PK, nombre, fecha_inicio, fecha_fin, estado, id_proyecto FK→Proyecto)
Tarea (id_tarea PK, titulo, descripción, fecha_limite, estado, prioridad, id_proyecto FK→Proyecto, id_sprint FK→Sprint, id_asignado FK→Usuario)
Comentario (id_comentario PK, texto, fecha, id_tarea FK→Tarea, id_usuario FK→Usuario)
Archivo (id_archivo PK, nombre, ruta, tipo, fecha_subida, id_tarea FK→Tarea)
Notificacion (id_notificacion PK, mensaje, tipo, leida, fecha, id_usuario FK→Usuario)

## Autenticación

- Auth vía Supabase (email/contraseña) con PKCE flow
- `middleware.ts` → refresca sesión y protege rutas (redirige a /login si no hay sesión)
- `lib/supabase-server.ts` → createServerClient con cookies (para Server Components y Route Handlers)
- `lib/supabase-browser.ts` → createBrowserClient (para componentes cliente: login, signout)
- Login en `app/(auth)/login/page.tsx`
- Callback OAuth en `app/(auth)/callback/route.ts`
- Signout via `app/api/auth/signout/route.ts`

## Filtrado por usuario

Cada página filtra datos según el usuario autenticado:

1. Se obtiene `user.id` de `supabase.auth.getUser()`
2. Se consulta `Proyecto_Miembro` para obtener los `id_proyecto` del usuario
3. Todas las queries se filtran con `.in("id_proyecto", proyectoIds)`
4. Tareas se filtran adicionalmente por `id_asignado`

## CRUD planeado

- **Proyectos**: Solo admin puede crear (botón visible condicionalmente por rol)
- **Tareas**: Auto-asignación vía botón "Tomar tarea" → `POST /api/tareas/[id]/asignar`
- (Futuro) Crear/editar tareas, sprints, comentarios

## Patrón de datos

- Server Components asíncronos → fetch directo con supabase.from("Tabla").select()
- Joins con sintaxis `Tabla ( campo )` (FK automático por nombre de columna)
- Datos formateados en el Server Component antes de pasar a componentes cliente
- Para filtrar por tabla relacionada: obtener IDs primero desde la tabla puente, luego `.in()`
