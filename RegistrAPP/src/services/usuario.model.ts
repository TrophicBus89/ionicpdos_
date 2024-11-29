export interface Usuario {
  id: string;
  tipo: string;
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  asignaturas_inscritas?: string[];
}

export interface Asignatura {
  id: string;
  codigo: string;
  nombre: string;
  seccion: string;
  profesor_id: string;
}