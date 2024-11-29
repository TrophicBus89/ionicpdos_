import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, Asignatura } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // URL del JSON alojado en tu dominio
  private baseUrl = 'https://registraappdr.me/jsonServer/data.json';

  constructor(private http: HttpClient) {}

  // Obtiene todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(data => data.usuarios) // Filtra solo los usuarios
    );
  }

  // Obtiene todas las asignaturas
  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(data => data.asignaturas) // Filtra solo las asignaturas
    );
  }

  // Obtiene las asignaturas inscritas por un usuario
  getAsignaturasInscritas(usuario: Usuario): Observable<Asignatura[]> {
    return this.getAsignaturas().pipe(
      map(asignaturas =>
        asignaturas.filter(asignatura =>
          usuario.asignaturas_inscritas?.includes(asignatura.id) // Verifica las asignaturas inscritas
        )
      )
    );
  }

  // Obtiene un profesor por su ID
  getProfesorPorId(profesorId: string): Observable<Usuario | undefined> {
    return this.getUsuarios().pipe(
      map(usuarios =>
        usuarios.find(usuario => usuario.id === profesorId && usuario.tipo === 'profesor') // Busca por ID y tipo
      )
    );
  }

  // Valida un usuario por correo y contraseña
  validarUsuario(correo: string, contrasena: string): Observable<Usuario | undefined> {
    return this.getUsuarios().pipe(
      map(usuarios =>
        usuarios.find(usuario => usuario.correo === correo && usuario.contrasena === contrasena) // Valida credenciales
      )
    );
  }

  // Obtiene todas las asistencias
  getAsistencias(): Observable<any[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(data => data.asistencias) // Filtra solo las asistencias
    );
  }

  // Actualiza un usuario (este método no funcionará con GitHub Pages)
  actualizarUsuario(usuario: any): Observable<any> {
    const url = `${this.baseUrl}/usuarios/${usuario.id}`;
    return this.http.put(url, usuario); // Este endpoint no es válido con GitHub Pages
  }

  // Obtiene los alumnos inscritos en una asignatura específica
  getAlumnosPorAsignatura(asignaturaId: string): Observable<any[]> {
    return this.getUsuarios().pipe(
      map(usuarios =>
        usuarios.filter(usuario =>
          usuario.tipo === 'alumno' && usuario.asignaturas_inscritas?.includes(asignaturaId)
        )
      )
    );
  }

  // Actualiza una asistencia (este método no funcionará con GitHub Pages)
  actualizarAsistencias(asistencia: any): Observable<any> {
    const url = `${this.baseUrl}/asistencias/${asistencia.id}`;
    return this.http.put(url, asistencia); // Este endpoint no es válido con GitHub Pages
  }

  // Crea una nueva asistencia (este método no funcionará con GitHub Pages)
  crearAsistencia(asistencia: any): Observable<any> {
    const url = `${this.baseUrl}/asistencias`;
    return this.http.post(url, asistencia); // Este endpoint no es válido con GitHub Pages
  }
}
