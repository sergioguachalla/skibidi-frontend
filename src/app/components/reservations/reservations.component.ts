import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {Reservation} from "../../Model/reservation.model";
import {NgForOf, NgIf} from "@angular/common";
import {KeycloakService} from "keycloak-angular";
import {StudyRoomService} from "../../services/study-room.service";

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit{

  reservations: Reservation[] = [];

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

}
