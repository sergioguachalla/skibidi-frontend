import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-environment-reservation',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './environment-reservation.component.html',
  styleUrls: ['./environment-reservation.component.css']
})
export class EnvironmentReservationComponent {
  reservation = {
    clientId: '',
    environmentId: '',
    reservationDate: '',
    clockIn: '',
    clockOut: '',
    purpose: ''
  };

  users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
  ];

  environments = [
    { id: 1, name: 'Sala 1' },
    { id: 2, name: 'Sala 2' },
  ];

  onSubmit() {
    console.log('Reserva de ambiente:', this.reservation);
    // Aquí puedes enviar la reserva al backend o manejarla
  }
}
