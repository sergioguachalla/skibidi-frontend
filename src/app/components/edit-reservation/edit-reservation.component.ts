import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { NgForOf, NgIf } from "@angular/common";
import { Environment, EnvironmentReservationDto } from "../../Model/environment.model";
import { UserClient } from "../../Model/userclient.model";
import { EnvironmentService } from "../../services/environment.service";
import { UserClientService } from "../../services/userclient.service";
import {ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
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
export class EditReservationComponent implements OnInit {
  environments: Environment[] = [];
  availableEnvironments: Environment[] = [];
  userClients: UserClient[] = [];
  selectedEnvironmentId: number | null = null;
  selectedClientId: string | null = null;
  reservationId: number | null = null;
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

  minReservationDate: string = '';
  clockInTime: string = '';
  clockOutTime: string = '';

  timeErrorMessage: string = '';
  dateErrorMessage: string = '';

  constructor(
    private environmentService: EnvironmentService,
    private userClientService: UserClientService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.reservationId = +id;
        this.loadReservation(this.reservationId);
      }
    });

    this.userClientService.getAllUserClients().subscribe(response => {
      this.userClients = response.data;
    });

    this.loadAvailableEnvironments();
    this.minReservationDate = this.getTodayDate();
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isTimeValid(clockIn: string, clockOut: string): boolean {
    return clockIn < clockOut;
  }

  updateClockIn(time: string): void {
    if (time) {
      this.clockInTime = time;

      if (this.clockOutTime && !this.isTimeValid(this.clockInTime, this.clockOutTime)) {
        this.timeErrorMessage = "La hora de entrada debe ser menor que la hora de salida.";
      } else {
        this.timeErrorMessage = '';
        this.loadAvailableEnvironments();
      }
    }
  }

  updateClockOut(time: string): void {
    if (time) {
      this.clockOutTime = time;

      if (this.clockInTime && !this.isTimeValid(this.clockInTime, this.clockOutTime)) {
        this.timeErrorMessage = "La hora de salida debe ser mayor que la hora de entrada.";
      } else {
        this.timeErrorMessage = '';
        this.loadAvailableEnvironments();
      }
    }
  }

  confirmSubmission(): void {
    if (this.reservationId === null) {
      console.error('No se puede actualizar la reserva sin un ID válido');
      return;
    }

    const reservationDate = this.reservation.reservationDate;
    const clockInTimeParts = this.clockInTime.split(":");
    const clockOutTimeParts = this.clockOutTime.split(":");

    let clockInDate = new Date(`${reservationDate}T00:00:00`);
    clockInDate.setHours(parseInt(clockInTimeParts[0]), parseInt(clockInTimeParts[1]), 0);

    let clockOutDate = new Date(`${reservationDate}T00:00:00`);
    clockOutDate.setHours(parseInt(clockOutTimeParts[0]), parseInt(clockOutTimeParts[1]), 0);

    clockInDate.setHours(clockInDate.getHours() - 4);
    clockOutDate.setHours(clockOutDate.getHours() - 4);

    this.reservation.clockIn = clockInDate;
    this.reservation.clockOut = clockOutDate;
    this.reservation.status=1;

    this.environmentService.updateEnvironmentReservation(this.reservationId, this.reservation).subscribe(response => {
      const modalElement = document.getElementById('confirmationModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      alert('Reserva modificada exitosamente.');

      this.router.navigate(['/view-book']);
    }, error => {
      console.error('Error al actualizar la reserva:', error);
    });
  }



  loadAvailableEnvironments(): void {
    const reservationDate = this.reservation.reservationDate;
    if (reservationDate && this.clockInTime && this.clockOutTime) {
      const from = `${reservationDate}T${this.clockInTime}:00`;
      const to = `${reservationDate}T${this.clockOutTime}:00`;

      this.environmentService.getEnvironmentsAvailability(from, to).subscribe(response => {
        this.availableEnvironments = response.data.filter(env => {
          const isSelectedEnvironment = env.environmentId === this.reservation.environmentId;
          const isSameReservation = this.isCurrentReservationSameTime();

          return env.isAvailable || (isSelectedEnvironment && isSameReservation);
        });

        const selectedEnvExists = this.availableEnvironments.some(
          env => env.environmentId === this.selectedEnvironmentId
        );

        if (!selectedEnvExists && this.availableEnvironments.length > 0) {
          this.selectedEnvironmentId = this.availableEnvironments[0].environmentId;
        }
      });
    }
  }



  isCurrentReservationSameTime(): boolean {
    const reservationDateTimeIn = new Date(this.reservation.reservationDate + 'T' + this.clockInTime);
    const reservationDateTimeOut = new Date(this.reservation.reservationDate + 'T' + this.clockOutTime);

    const originalReservationIn = new Date(this.reservation.clockIn);
    const originalReservationOut = new Date(this.reservation.clockOut);

    return (
      reservationDateTimeIn.getTime() === originalReservationIn.getTime() &&
      reservationDateTimeOut.getTime() === originalReservationOut.getTime()
    );
  }


  updateReservationDate(date: string): void {
    if (date) {
      this.reservation.reservationDate = date;
      this.loadAvailableEnvironments();
    }
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
          reservationStatus: response.data.status === 1,
          status: response.data.status
        };
        this.selectedEnvironmentId = this.reservation.environmentId;
        this.selectedClientId = this.reservation.clientId;

        this.clockInTime = this.getTimeString(this.reservation.clockIn);
        this.clockOutTime = this.getTimeString(this.reservation.clockOut);

          this.loadAvailableEnvironments();
      }
    }, error => {
      console.error('Error al cargar la reserva:', error);
    });
  }

  openConfirmationModal(): void {
    if (this.selectedEnvironmentId && this.selectedClientId) {
      const selectedUser = this.userClients.find(user => user.kcUuid === this.selectedClientId);
      const selectedEnvironment = this.availableEnvironments.find(env => env.environmentId === this.selectedEnvironmentId);

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


  getTimeString(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  isFormValid(): boolean {
    if (!this.selectedEnvironmentId) {
      return false;
    }

    if (!this.reservation.reservationDate || new Date(this.reservation.reservationDate) < new Date(this.minReservationDate)) {
      this.dateErrorMessage = "La fecha de reserva debe ser mayor o igual a la fecha actual.";
      return false;
    }else {
      this.dateErrorMessage = '';
    }

    if (!this.clockInTime || !this.clockOutTime || !this.isTimeValid(this.clockInTime, this.clockOutTime)) {
      return false;
    }

    if (!this.reservation.purpose || this.reservation.purpose.trim().length === 0) {
      return false;
    }

    return true;
  }



}
