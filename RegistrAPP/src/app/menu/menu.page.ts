import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Usuario } from '../../services/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  usuario: Usuario | null = null; // Variable para almacenar el usuario activo

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const usuario = this.authService.getUser();
    if (usuario) {
      console.log('Usuario autenticado:', usuario);
      this.usuario = usuario;
    } else {
      console.warn('No hay usuario autenticado.');
    }
  }

  logout() {
    this.authService.logout(); // Cierra sesión
    this.router.navigate(['/home']); // Redirige al inicio de sesión  
    location.reload();
  }
}