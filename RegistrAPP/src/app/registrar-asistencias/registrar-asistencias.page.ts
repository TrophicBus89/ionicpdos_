import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-registrar-asistencias',
  templateUrl: './registrar-asistencias.page.html',
  styleUrls: ['./registrar-asistencias.page.scss'],
})
export class RegistrarAsistenciasPage implements OnInit {
  idAsignatura: string = '';
  fecha: string = '';
  modoManual: boolean = false;
  alumnoId: string = '';

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUser();
    if (usuario) {
      this.alumnoId = usuario.id;
    }
  }

  // Método para mostrar inputs del modo manual
  mostrarInputsManual() {
    this.modoManual = true;
  }

  // Método para activar el escáner QR
  modoEscanear() {
    const qrReader = new Html5Qrcode("qr-reader");
    qrReader.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        console.log("QR escaneado:", decodedText);
        qrReader.stop().then(() => {
          this.procesarQR(decodedText);
        }).catch((err) => {
          console.error("Error al detener el escáner QR:", err);
        });
      },
      (errorMessage) => {
        // Controlar el error sin mostrarlo repetidamente en la consola
        if (!errorMessage.includes("NotFoundException")) {
          console.error("Error en la lectura del QR:", errorMessage);
        }
      }
    ).catch((err) => {
      console.error("Error al iniciar el escáner QR:", err);
    });
  }

  // Método para procesar el QR escaneado
  async procesarQR(qrText: string) {
    try {
      // Separar los datos del QR
      let [asignaturaId, fecha] = qrText.split(';');
  
      // Convertir los datos al mismo formato que el método manual
      asignaturaId = asignaturaId.trim();
      
      // Asegurarnos de que la fecha esté en formato 'YYYY-MM-DD'
      const fechaPartes = fecha.split('-');
      if (fechaPartes.length === 3) {
        fecha = `${fechaPartes[2]}-${fechaPartes[1]}-${fechaPartes[0]}`; // Formato YYYY-MM-DD
      }
  
      console.log("Datos transformados:", asignaturaId, fecha);
  
      // Llamar al método manual para registrar la asistencia
      await this.registrarAsistenciaManual(asignaturaId, fecha);
    } catch (error) {
      console.error("Error al procesar el QR:", error);
      this.mostrarAlerta("Error", "El formato del QR es inválido.");
    }
  }

  // Método para registrar asistencia manualmente
  async registrarAsistenciaManual(asignaturaId?: string, fecha?: string) {
    try {
      const idAsignatura = asignaturaId || this.idAsignatura;
      const fechaIngresada = fecha || this.fecha;

      // Obtener asistencias actuales del backend
      const asistencias = await this.usuarioService.getAsistencias().toPromise() || [];
      console.log("Asistencias obtenidas:", asistencias);

      // Buscar la asistencia existente
      const asistenciaExistente = asistencias.find(asistencia =>
        asistencia.alumno_id === this.alumnoId &&
        asistencia.asignatura_id === idAsignatura &&
        asistencia.fecha === fechaIngresada
      );

      if (asistenciaExistente) {
        if (asistenciaExistente.estado === 'ausente') {
          asistenciaExistente.estado = 'presente';
          await this.usuarioService.actualizarAsistencias(asistenciaExistente).toPromise();
          this.mostrarAlerta("Éxito", "Asistencia registrada exitosamente.");
        } else {
          this.mostrarAlerta("Información", "La asistencia ya está marcada como presente.");
        }
      } else {
        this.mostrarAlerta("Error", "No se encontró una asistencia pendiente para esta fecha y asignatura.");
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      this.mostrarAlerta("Error", "Ocurrió un error al registrar la asistencia.");
    }
  }

  // Método para mostrar una alerta
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
