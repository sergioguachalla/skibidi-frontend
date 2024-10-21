import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  private keycloakService: KeycloakService = inject(KeycloakService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.checkForLogout();
    this.checkAuthentication();
  }

  private checkForLogout(): void {
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        this.performLogout();
      }
    });
  }

  private performLogout(): void {
    this.keycloakService.logout(window.location.origin).then(() => {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/']);
      console.log('Sesión cerrada correctamente');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  async checkAuthentication(): Promise<void> {
    try {
      const isLoggedIn = await this.keycloakService.isLoggedIn();
      const currentUrl = this.router.url;
      if (isLoggedIn && currentUrl === '/') {
        console.log('Usuario autenticado, redirigiendo a /view-book');
        this.router.navigate(['/view-book']);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
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
    const isbn = (document.getElementById('isbnInput') as HTMLInputElement).value;
    console.log(`ISBN ingresado: ${isbn}`);
    (window as any).bootstrap.Modal.getInstance(
      document.getElementById('registerIsbnModal'),
    ).hide();
  }
}
