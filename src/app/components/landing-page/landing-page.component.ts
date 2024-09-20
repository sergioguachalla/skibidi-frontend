import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  private keycloakService: KeycloakService = inject(KeycloakService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const isLoggedIn: boolean = this.keycloakService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/view-book']);
    }
  }

  onLogin(): void {
    this.keycloakService.login().then(() => {
      this.checkAuthentication();
    }).catch((error) => {
      console.error('Error al intentar iniciar sesión:', error);
    });
  }

  onRegisterCustomer(): void {
    this.router.navigate(['/register-customer']);
  }

  onRegisterLibrarian(): void {
    this.router.navigate(['/register-librarian']);
  }

  onViewBooks(): void {
    throw new Error(
      'Method not implemented. check LandingPageComponent.ts > onViewBooks()',
    );
  }

  openRegisterBookModal(): void {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('chooseRegistrationModal'),
    );
    modal.show();
  }

  openIsbnModal(): void {
    (window as any).bootstrap.Modal.getInstance(
      document.getElementById('chooseRegistrationModal'),
    ).hide();

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('registerIsbnModal'),
    );
    modal.show();
  }

  submitIsbn(): void {
    const isbn = (document.getElementById('isbnInput') as HTMLInputElement)
      .value;

    console.log(`ISBN ingresado: ${isbn}`);

    (window as any).bootstrap.Modal.getInstance(
      document.getElementById('registerIsbnModal'),
    ).hide();
  }
}
