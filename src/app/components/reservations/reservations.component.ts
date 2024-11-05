import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {Reservation} from "../../Model/reservation.model";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {KeycloakService} from "keycloak-angular";
import {StudyRoomService} from "../../services/study-room.service";
import { Router } from "@angular/router";
import {EnvironmentService} from "../../services/environment.service";

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    CommonModule  // Importa CommonModule para usar ngClass
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit{

  reservations: Reservation[] = [];
  isModalOpen = false;  // Para controlar la visibilidad del modal
  reservationIdToCancel: number | null = null;  // Para guardar el ID de la reservación a cancelar
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 2;

  constructor(
    private kcService: KeycloakService,
    private studyRoomService: StudyRoomService,
    private router: Router,
    private environmentService: EnvironmentService
  ) {
  }
  ngOnInit(): void {

    this.getReservations(this.currentPage);
  }

  getReservations(page: number): void{
    const kcId= this.kcService.getKeycloakInstance().subject!;
    this.studyRoomService.getReservations(kcId,page, 2).subscribe(
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


  cancelReservation(reservationId: number): void {
    const status = 3;
    this.environmentService.updateEnvironmentReservationStatus(reservationId, status).subscribe(
      response => {
        if (response.successful) {
          alert("Reservación cancelada con éxito.");
          this.ngOnInit();
        } else {
          alert("Hubo un error al cancelar la reservación.\n" + response.message);
        }
      },
      error => {
        alert("Error en la solicitud: " + error.message);
      }
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.getReservations(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.getReservations(this.currentPage - 1);
    }
  }
  openModal(reservationId: number): void {
    this.reservationIdToCancel = reservationId; // Guarda el ID de la reservación
    this.isModalOpen = true; // Abre el modal
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

  editReservation(reservation: any): void {
    this.router.navigate(['/client-environment/edit', reservation.reservationId]);
  }
}
