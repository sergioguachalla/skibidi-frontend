import { Component, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  private keycloakService: KeycloakService = inject(KeycloakService);

  constructor() {
  }

  login() {
    this.keycloakService.login();
  }


}
