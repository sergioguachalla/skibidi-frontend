import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private keycloakService: KeycloakService = inject(KeycloakService);

  constructor(private router: Router) {}

  login() {
    this.keycloakService.login();
  }
  logout() {
    this.keycloakService.logout();
  }

  onClickToHome() {
    this.router.navigate(['/']);
  }
}
