import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Environment, EnvironmentReservationDto } from '../../Model/environment.model';
import { EnvironmentService } from '../../services/environment.service';
import { UserClientService } from '../../services/userclient.service';
import { UserClient } from '../../Model/userclient.model';

declare var bootstrap: any;

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule, NavbarComponent, CommonModule],
  templateUrl: './environment-reservation.component.html',
  styleUrls: ['./environment-reservation.component.css']
})
export class ReservationComponent implements OnInit {
  environments: Environment[] = [];
  userClients: UserClient[] = [];
  selectedEnvironmentId: number | null = null;
  selectedClientId: number | null = null;

  reservation: EnvironmentReservationDto = {
    clientId: 0,
    environmentId: 0,
    reservationDate: '',
    clockIn: new Date(),
    clockOut: new Date(),
    purpose: '',
    reservationStatus: false,
    status: 1
  };

  constructor(
    private environmentService: EnvironmentService,
    private userClientService: UserClientService
  ) {}

  ngOnInit(): void {
    this.environmentService.getAllEnvironments().subscribe(response => {
      this.environments = response.data;
    });

    this.userClientService.getAllUserClients().subscribe(response => {
      this.userClients = response.data;
    });
  }

  openConfirmationModal(): void {
    if (this.selectedEnvironmentId && this.selectedClientId) {
      this.reservation.environmentId = this.selectedEnvironmentId;
      this.reservation.clientId = this.selectedClientId;
      const modalElement = document.getElementById('confirmationModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('No se ha seleccionado un ambiente o un cliente');
    }
  }

  confirmSubmission(): void {
    const reservationDate = this.reservation.reservationDate;
    this.reservation.clockIn = new Date(`${reservationDate}T${this.reservation.clockIn}:00`);
    this.reservation.clockOut = new Date(`${reservationDate}T${this.reservation.clockOut}:00`);

    console.log('Datos enviados para la reserva:', this.reservation);

    this.environmentService.createEnvironmentReservation(this.reservation).subscribe(response => {
      console.log('Reserva realizada:', response);
      const modalElement = document.getElementById('confirmationModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }, error => {
      console.error('Error al realizar la reserva:', error);
    });
  }

  getUserNameById(clientId: number | null): string {
    const user = this.userClients.find(user => user.clientId === clientId);
    return user ? user.username : 'Desconocido';
  }

  getEnvironmentNameById(environmentId: number | null): string {
    const environment = this.environments.find(env => env.environmentId === environmentId);
    return environment ? environment.name : 'Desconocido';
  }
}
