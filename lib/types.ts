export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  icono: string | null;
  created_at: string;
}

export interface Actividad {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  categoria_id: string | null;
  created_at: string;
  categoria?: Categoria;
}

export interface Facilitador {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  whatsapp: string | null;
  foto_url: string | null;
  bio: string | null;
  ciudad: string;
  latitud: number;
  longitud: number;
  direccion: string | null;
  instagram: string | null;
  sitio_web: string | null;
  activo: boolean;
  created_at: string;
  actividades?: Actividad[];
}

export interface FacilitadorConActividades extends Facilitador {
  facilitador_actividades: {
    actividades: Actividad;
  }[];
}
