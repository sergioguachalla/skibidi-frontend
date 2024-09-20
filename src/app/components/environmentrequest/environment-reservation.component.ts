import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Environment, EnvironmentReservationDto } from '../../Model/environment.model';
import { EnvironmentService } from '../../services/environment.service';
import { UserClientService } from '../../services/userclient.service';  
import { UserClient } from '../../Model/userclient.model';  

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
    clockIn: new Date(),  // Iniciar con el objeto Date
    clockOut: new Date(), // Iniciar con el objeto Date
    purpose: '',
    reservationStatus: false,  // Estático
    status: 1  // Estático
  };

  constructor(
    private environmentService: EnvironmentService,
    private userClientService: UserClientService  
  ) {}

  ngOnInit(): void {
    // Cargar los ambientes
    this.environmentService.getAllEnvironments().subscribe(response => {
      this.environments = response.data;
    });

    // Cargar los usuarios
    this.userClientService.getAllUserClients().subscribe(response => {
      this.userClients = response.data;  
    });
  }

  makeReservation(): void {
    if (this.selectedEnvironmentId && this.selectedClientId) {
      this.reservation.environmentId = this.selectedEnvironmentId;
      this.reservation.clientId = this.selectedClientId;
  
      // Crear el formato adecuado para clockIn y clockOut
      const reservationDate = this.reservation.reservationDate;
      this.reservation.clockIn = new Date(`${reservationDate}T${this.reservation.clockIn}:00`);
      this.reservation.clockOut = new Date(`${reservationDate}T${this.reservation.clockOut}:00`);
  
      console.log('Datos enviados para la reserva:', this.reservation);
  
      this.environmentService.createEnvironmentReservation(this.reservation).subscribe(response => {
        console.log('Reserva realizada:', response);
      }, error => {
        console.error('Error al realizar la reserva:', error);
      });
    } else {
      console.error('No se ha seleccionado un ambiente o un cliente');
    }
  }
}
