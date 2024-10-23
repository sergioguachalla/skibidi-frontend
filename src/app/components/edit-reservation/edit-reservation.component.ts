import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {NgForOf, NgIf} from "@angular/common";
import {Environment, EnvironmentReservationDto} from "../../Model/environment.model";
import {UserClient} from "../../Model/userclient.model";
import {EnvironmentService} from "../../services/environment.service";
import {UserClientService} from "../../services/userclient.service";
import {ActivatedRoute} from '@angular/router'; // Importa ActivatedRoute
declare var bootstrap: any;

@Component({
  selector: 'app-edit-reservation',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './edit-reservation.component.html',
  styleUrl: './edit-reservation.component.css'
})
export class EditReservationComponent implements OnInit{
  environments: Environment[] = [];
  userClients: UserClient[] = [];
  selectedEnvironmentId: number | null = null;
  selectedClientId: string | null = null;
  reservationId: number | null = null; // Añade esta propiedad para guardar el ID de la reserva

  reservation: EnvironmentReservationDto = {
    clientId: "",
    environmentId: 0,
    reservationDate: '',
    clockIn: new Date(),
    clockOut: new Date(),
    purpose: '',
    reservationStatus: false,
    status: 1
  };

  selectedUserName: string = '';
  selectedEnvironmentName: string = '';

  constructor(
    private environmentService: EnvironmentService,
    private userClientService: UserClientService,
    private route: ActivatedRoute // Añade ActivatedRoute al constructor
  ) {}

  ngOnInit(): void {
    // Obtén el ID de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.reservationId = +id;
        this.loadReservation(this.reservationId);
      }
    });

    // Carga todos los ambientes y usuarios disponibles
    this.environmentService.getAllEnvironments().subscribe(response => {
      this.environments = response.data;
    });

    this.userClientService.getAllUserClients().subscribe(response => {
      this.userClients = response.data;
    });
  }

  loadReservation(id: number): void {
    this.environmentService.getEnvironmentReservationById(id).subscribe((response: any) => {
      if (response && response.data) {
        this.reservation = {
          clientId: response.data.clientId,
          environmentId: response.data.environmentId,
          reservationDate: response.data.reservationDate,
          clockIn: new Date(response.data.clockIn),
          clockOut: new Date(response.data.clockOut),
          purpose: response.data.purpose,
          reservationStatus: response.data.status === 1, // Ajustar según sea necesario
          status: response.data.status
        };
        this.selectedEnvironmentId = this.reservation.environmentId;
        this.selectedClientId = this.reservation.clientId;
      }
    }, error => {
      console.error('Error al cargar la reserva:', error);
    });
  }



  openConfirmationModal(): void {
    if (this.selectedEnvironmentId && this.selectedClientId) {
      const selectedUser = this.userClients.find(user => user.kcUuid === this.selectedClientId);
      const selectedEnvironment = this.environments.find(env => env.environmentId === this.selectedEnvironmentId);

      this.selectedUserName = selectedUser ? selectedUser.username : 'Desconocido';
      this.selectedEnvironmentName = selectedEnvironment ? selectedEnvironment.name : 'Desconocido';

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
    if (this.reservationId === null) {
      console.error('No se puede actualizar la reserva sin un ID válido');
      return;
    }

    const reservationDate = this.reservation.reservationDate;
    this.reservation.clockIn = new Date(`${reservationDate}T${this.formattedClockIn}:00`);
    this.reservation.clockOut = new Date(`${reservationDate}T${this.formattedClockOut}:00`);


    // Actualiza la reserva usando el método PUT
    this.environmentService.updateEnvironmentReservation(this.reservationId, this.reservation).subscribe(response => {
      const modalElement = document.getElementById('confirmationModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }, error => {
      console.error('Error al actualizar la reserva:', error);
    });
  }

  get formattedClockIn(): string {
    return this.reservation.clockIn ? this.reservation.clockIn.toISOString().substring(11, 16) : '';
  }

  get formattedClockOut(): string {
    return this.reservation.clockOut ? this.reservation.clockOut.toISOString().substring(11, 16) : '';
  }

  updateClockIn(time: string): void {
    if (time) {
      const [hours, minutes] = time.split(':');
      const clockInDate = new Date(this.reservation.reservationDate);
      clockInDate.setHours(+hours, +minutes, 0, 0);
      this.reservation.clockIn = clockInDate;
    }
  }

  updateClockOut(time: string): void {
    if (time) {
      const [hours, minutes] = time.split(':');
      const clockOutDate = new Date(this.reservation.reservationDate);
      clockOutDate.setHours(+hours, +minutes, 0, 0);
      this.reservation.clockOut = clockOutDate;
    }
  }


}
