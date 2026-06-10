export type UsuarioRol = 'admin' | 'equipo' | 'cliente';

export type ProyectoEstado = 'Planificación' | 'Activo' | 'En Pausa' | 'Completado';

export type TareaEstado = 'Pendiente' | 'En progreso' | 'Completada' | 'Bloqueada';

export type TareaPrioridad = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export type SprintEstado = 'Planificación' | 'Activo' | 'Completado';

export interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  fecha_registro: string;
}

export interface Cliente {
  id_cliente: number;
  nombre: string;
  empresa: string;
  contacto: string | null;
  email: string;
  telefono: string | null;
  id_usuario_fk: string | null;
  Usuario?: Usuario;
}

export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: ProyectoEstado;
  id_cliente: number;
  Cliente?: Cliente;
  Proyecto_Miembro?: Array<{ id_usuario: string; Usuario?: Usuario }>;
}

export interface Sprint {
  id_sprint: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: SprintEstado;
  id_proyecto: number;
}

export interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  estado: TareaEstado;
  prioridad: TareaPrioridad;
  id_proyecto: number;
  id_sprint: number | null;
  id_asignado: string | null;
  Proyecto?: Proyecto;
  Sprint?: Sprint;
  Usuario?: Usuario;
}

export interface Comentario {
  id_comentario: number;
  texto: string;
  fecha: string;
  id_tarea: number;
  id_usuario: string;
  Usuario?: Usuario;
}

export interface Archivo {
  id_archivo: number;
  nombre: string;
  ruta: string;
  tipo: string | null;
  fecha_subida: string;
  id_tarea: number;
}

export interface Notificacion {
  id_notificacion: number;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fecha: string;
  id_usuario: string;
}

export interface ProyectoConRelaciones extends Proyecto {
  Cliente: Cliente;
  miembros?: Array<{ id_usuario: string; Usuario: Usuario }>;
}

export interface TareaConRelaciones extends Tarea {
  Proyecto: Proyecto;
  Sprint: Sprint | null;
  Usuario: Usuario | null;
}