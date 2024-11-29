import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../../services/usuario.model';

@Component({
  selector: 'app-revisar-asistencias',
  templateUrl: './revisar-asistencias.page.html',
  styleUrls: ['./revisar-asistencias.page.scss'],
})
export class RevisarAsistenciasPage implements OnInit {
  asignaturaId: string = '';
  fecha: string = '';
  qrText: string = '';
  asignaturas: any[] = [];

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUser();
    if (usuario && usuario.tipo === 'profesor') {
      this.cargarAsignaturas(usuario);
    }
  }

  cargarAsignaturas(usuario: any) {
    // Obtener todas las asignaturas y filtrar por el profesor actual
    this.usuarioService.getAsignaturas().subscribe((asignaturas) => {
      // Filtrar asignaturas donde el profesor_id coincida con el ID del usuario
      this.asignaturas = asignaturas
        .filter(asignatura => asignatura.profesor_id === usuario.id)
        .map(asignatura => ({
          id: asignatura.id,
          nombre: `${asignatura.nombre} - ${asignatura.seccion}`
        }));
    });
  }

  generarQR() {
    if (this.asignaturaId && this.fecha) {
      const fechaFormateada = this.fecha.split('-').reverse().join('-');
      this.qrText = `${this.asignaturaId};${fechaFormateada}`;
      console.log("Código QR generado:", this.qrText);
    } else {
      alert('Por favor, selecciona una asignatura e ingresa una fecha.');
    }
  }

  async mostrarConfirmacion() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas generar el código QR y registrar las asistencias?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.generarQR();
            this.generarAsistencias();
          }
        }
      ]
    });

    await alert.present();
  }

  async generarAsistencias() {
    try {
      const alumnos = await this.usuarioService.getAlumnosPorAsignatura(this.asignaturaId).toPromise() || [];
      console.log("Alumnos inscritos:", alumnos);
  
      if (alumnos.length === 0) {
        console.warn("No se encontraron alumnos para la asignatura:", this.asignaturaId);
        return;
      }
  
      const asistenciasExistentes = await this.usuarioService.getAsistencias().toPromise() || [];
      console.log("Asistencias existentes antes de actualizar:", asistenciasExistentes);
  
      const siguienteId = (asistenciasExistentes.length || 0) + 1;
  
      for (let index = 0; index < alumnos.length; index++) {
        const nuevaAsistencia = {
          id: (siguienteId + index).toString(),
          alumno_id: alumnos[index].id,
          asignatura_id: this.asignaturaId,
          fecha: this.fecha,
          estado: 'ausente'
        };
  
        const asistenciaExistente = asistenciasExistentes.find(asistencia =>
          asistencia.alumno_id === nuevaAsistencia.alumno_id &&
          asistencia.asignatura_id === nuevaAsistencia.asignatura_id &&
          asistencia.fecha === nuevaAsistencia.fecha
        );
  
        if (asistenciaExistente) {
          // Actualizar asistencia existente
          console.log("Actualizando asistencia existente:", asistenciaExistente);
          asistenciaExistente.estado = 'ausente';
          await this.usuarioService.actualizarAsistencias(asistenciaExistente).toPromise();
        } else {
          // Crear nueva asistencia
          console.log("Creando nueva asistencia:", nuevaAsistencia);
          await this.usuarioService.crearAsistencia(nuevaAsistencia).toPromise();
        }
      }
  
      console.log("Asistencias generadas y actualizadas correctamente.");
      alert('Asistencias generadas exitosamente.');
    } catch (error) {
      console.error("Error al generar asistencias:", error);
      alert('Ocurrió un error al generar las asistencias.');
    }
  }
}
