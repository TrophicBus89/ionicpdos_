import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.page.html',
  styleUrls: ['./cambiar-clave.page.scss'],
})
export class CambiarClavePage {
  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  repetirContrasena: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  esValidaContrasena(contrasena: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(contrasena);
  }

  puedeCambiarContrasena(): boolean {
    return (
      this.nuevaContrasena === this.repetirContrasena &&
      this.esValidaContrasena(this.nuevaContrasena)
    );
  }

  async cambiarContrasena() {
    const usuario = this.authService.getUser();

    if (usuario && usuario.contrasena === this.contrasenaActual) {
      usuario.contrasena = this.nuevaContrasena;

      // Actualizar la contraseña en el archivo JSON
      this.usuarioService.actualizarUsuario(usuario).subscribe(async () => {
        const alert = await this.alertController.create({
          header: 'Cambio Exitoso',
          message: 'Tu contraseña ha sido actualizada correctamente.',
          buttons: ['OK'],
        });

        await alert.present();
        await alert.onDidDismiss();
        this.router.navigate(['/menu']);
      });
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La contraseña actual no es correcta.',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
}
