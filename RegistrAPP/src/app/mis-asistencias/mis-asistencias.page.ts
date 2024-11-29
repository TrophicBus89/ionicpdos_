import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-asistencias',
  templateUrl: './mis-asistencias.page.html',
  styleUrls: ['./mis-asistencias.page.scss'],
})
export class MisAsistenciasPage implements OnInit {
  asignaturas: { id: string; nombre: string; seccion: string; asistencias: any[] }[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUser();

    if (usuario && usuario.tipo === 'alumno') {
      // Obtener las asignaturas inscritas del usuario actual
      this.usuarioService.getAsignaturasInscritas(usuario).subscribe((asignaturas) => {
        // Obtener todas las asistencias desde el archivo data.json
        this.usuarioService.getAsistencias().subscribe((asistencias) => {
          console.log("Asistencias obtenidas del backend:", asistencias);

          // Filtrar y organizar las asignaturas con sus asistencias
          this.asignaturas = asignaturas.map((asignatura) => {
            const asistenciasAsignatura = asistencias
              .filter((asistencia) =>
                asistencia.alumno_id === usuario.id && asistencia.asignatura_id === asignatura.id
              )
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            return {
              ...asignatura,
              asistencias: asistenciasAsignatura,
            };
          });
        });
      });
    } else {
      console.log('No hay usuario autenticado, o el usuario no es un alumno.');
    }
  }

  verDetalles(asignaturaId: string) {
    this.router.navigate(['/asistencia-detalle', asignaturaId]);
  }
}