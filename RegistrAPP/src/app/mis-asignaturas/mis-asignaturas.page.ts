import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Asignatura } from '../../services/usuario.model';

@Component({
  selector: 'app-mis-asignaturas',
  templateUrl: './mis-asignaturas.page.html',
  styleUrls: ['./mis-asignaturas.page.scss'],
})
export class MisAsignaturasPage implements OnInit {
  asignaturas: { codigo: string; nombre: string; seccion: string; profesor: string }[] = [];

  constructor(private authService: AuthService, private usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this.authService.getUser();
  
    if (usuario) {
      this.usuarioService.getAsignaturasInscritas(usuario).subscribe(async (asignaturas) => {
        const asignaturasConProfesor = await Promise.all(
          asignaturas.map(async (asignatura) => {
            const profesor = await this.usuarioService.getProfesorPorId(asignatura.profesor_id).toPromise();
            return {
              codigo: asignatura.codigo, // Mostrar el código de la asignatura (MAT4140, etc.)
              nombre: asignatura.nombre,
              seccion: asignatura.seccion,
              profesor: profesor ? `${profesor.nombre} ${profesor.apellido}` : 'Desconocido'
            };
          })
        );
        this.asignaturas = asignaturasConProfesor;
      });
    } else {
      console.log('No hay usuario autenticado o el usuario no es un alumno.');
    }
  }
}
