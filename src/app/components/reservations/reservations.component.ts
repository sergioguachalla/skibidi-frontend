import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {Reservation} from "../../Model/reservation.model";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {KeycloakService} from "keycloak-angular";
import {StudyRoomService} from "../../services/study-room.service";

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


  constructor(private kcService: KeycloakService, private studyRoomService: StudyRoomService) {
  }
  ngOnInit(): void {
    const kcId= this.kcService.getKeycloakInstance().subject!;

    this.studyRoomService.getReservations(kcId).subscribe(
      response => {
        this.reservations = response.data;
      }
    );

   // this.reservations = [
     // { id: 1, roomName: 'Room A', reservedBy: 'John Doe', reservationDate: '2024-10-02', timeSlot: '10:00 AM - 12:00 PM' },
     // { id: 2, roomName: 'Room B', reservedBy: 'Jane Smith', reservationDate: '2024-10-03', timeSlot: '1:00 PM - 3:00 PM' },
     // { id: 3, roomName: 'Room C', reservedBy: 'Alice Johnson', reservationDate: '2024-10-04', timeSlot: '9:00 AM - 11:00 AM' }
   // ];
  }

  cancelReservation(reservationId: number): void {
    const status = 3;  // El número 3 indica que la reservación ha sido cancelada
    this.studyRoomService.updateEnvironmentReservation(reservationId, status).subscribe(
      response => {
        console.log("aaa"+response)
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


}
