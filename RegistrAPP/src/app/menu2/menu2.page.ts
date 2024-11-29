import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../services/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.page.html',
  styleUrls: ['./menu2.page.scss'],
})
export class Menu2Page implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

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
    this.router.navigate(['/home']);
    location.reload();
  }
}