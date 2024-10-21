import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ReservationHistoryService } from '../../services/reservation-history.service';

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
  reservations: any[] = [];

  constructor(private reservationHistoryService: ReservationHistoryService) { }

  ngOnInit(): void {
    this.getReservationHistory();
  }

  getReservationHistory(): void {
    this.reservationHistoryService.getReservationHistory().subscribe(
      (response) => {
        this.reservations = response.data || [];
      },
      (error) => {
        console.error('Error al obtener el historial de reservas:', error);
      }
    );
  }
}
