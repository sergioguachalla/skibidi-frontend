import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from '../../services/environment.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Environment, EnvironmentReservationDto } from '../../Model/environment.model';


@Component({
  selector: 'app-environment-reservation',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './environment-reservation.component.html',
  styleUrls: ['./environment-reservation.component.css']
})
export class EnvironmentReservationComponent implements OnInit {
  environments: Environment[] = [];
  reservation: EnvironmentReservationDto = {
    clientId: 0,
    environmentId: 0,
    reservationDate: '',
    clockIn: '',
    clockOut: '',
    purpose: ''
  };

  constructor(private environmentService: EnvironmentService) {}

  ngOnInit(): void {
    this.loadEnvironments();
  }

  loadEnvironments(): void {
    this.environmentService.getAllEnvironments().subscribe(
      response => {
        this.environments = response;
      },
      error => {
        console.error('Error al cargar los ambientes:', error);
      }
    );
  }

  onSubmit(): void {
    this.environmentService.createEnvironmentReservation(this.reservation).subscribe(
      response => {
        console.log('Reserva creada:', response);
      },
      error => {
        console.error('Error al crear la reserva:', error);
      }
    );
  }
}
