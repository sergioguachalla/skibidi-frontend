import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ReservationHistoryService } from '../../services/reservation-history.service';
import { Router } from "@angular/router";
import {StudyRoomService} from "../../services/study-room.service";
import {EnvironmentService} from "../../services/environment.service";

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent
  ],
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.css']
})
export class ReservationHistoryComponent implements OnInit {
  isModalOpen = false;
  reservationIdToCancel: number | null = null;

  reservations: any[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 7;

  constructor(
    private reservationHistoryService: ReservationHistoryService,
    private router: Router,
    private studyRoomService: StudyRoomService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.getReservationHistory(this.currentPage);
  }

  getReservationHistory(page: number): void {
    this.reservationHistoryService.getReservationHistory(page, 2).subscribe(
      (response) => {
        this.reservations = response.data.content || [];
        this.currentPage = response.data.number;
        this.totalPages = response.data.totalPages;
      },
      (error) => {
        console.error('Error al obtener el historial de reservas:', error);
      }
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.getReservationHistory(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.getReservationHistory(this.currentPage - 1);
    }
  }

  addReservation() {
    this.router.navigate(['/client-environment']);
  }

  editReservation(reservation: any): void {
    this.router.navigate(['/client-environment/edit', reservation.reservationId]);
  }


  confirmReservation(reservation: any): void {
    if (confirm('¿Estás seguro de que deseas aceptar esta reserva?')) {
      this.environmentService.updateEnvironmentReservationStatus(reservation.reservationId, 2).subscribe(
        (response) => {
          console.log("Reserva aceptar exitosamente:", response);
          this.getReservationHistory(this.currentPage);
        },
        (error) => {
          console.error("Error al aceptar la reserva:", error);
        }
      );
    }
  }

  //TODO: refactor
  cancelReservation(reservation: any): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.environmentService.updateEnvironmentReservationStatus(reservation.reservationId, 3).subscribe(
        (response) => {
          console.log("Reserva cancelada exitosamente:", response);
          if(!response.successful){
            alert("Hubo un error al cancelar la reservación.\n" + response.message);
          }
          this.getReservationHistory(this.currentPage);

        },
        (error) => {
          console.error("Error al cancelar la reserva:", error);
        }
      );
    }
  }

  // Nueva función para traducir el estado

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Aceptado';
      case 3:
        return 'Cancelado';
      case 4:
        return 'Finalizado';
      default:
        return 'Desconocido';
    }
  }

  closeModal(): void {
    this.isModalOpen = false; // Cierra el modal
    this.reservationIdToCancel = null; // Reinicia el ID
  }

  confirmCancel(): void {
    if (this.reservationIdToCancel !== null) {
      this.cancelReservation(this.reservationIdToCancel);
    }
    this.closeModal(); // Cierra el modal
  }
}
