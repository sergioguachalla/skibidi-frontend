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
    this.router.navigate(['/'], { queryParams: { logout: 'true' } });

  }



  onClickToHome() {
    this.router.navigate(['/books'], { queryParams: { page: 0 } });
  }

  onClickToEnvReservation() {
    this.router.navigate(['/reservation-enviroment']);
  }
  onClickToEnvReservationClient() {
    this.router.navigate(['/client-environment']);
  }

  onClickToReservations () {
    this.router.navigate(['/reservations'])
  }
  onClickToReservationsLibrarian(){
    this.router.navigate(['/reservation-history'])

  }
  onClickToRegisterManual() {
    this.router.navigate(['/ingresar-libro']);
  }

  onClickToLendClientHistory() {
    this.router.navigate(['lend-client-history']); // Asegúrate de que esta sea la ruta correcta
  }

  onClickToLendHistory() {
    this.router.navigate(['lend-history']); // Asegúrate de que esta sea la ruta correcta
  }
  onClickToLend() {
    this.router.navigate(['fines']);
  }


  openIsbnModal(): void {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('registerIsbnModal'),
    );
    modal.show();
  }
  goToMyInformation() {
    this.router.navigate(['/my-information']);
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
