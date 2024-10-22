import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ReservationHistoryService } from '../../services/reservation-history.service';
import { Router } from "@angular/router";

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
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 7;

  constructor(
    private reservationHistoryService: ReservationHistoryService,
    private router: Router
  ) { }

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
    this.router.navigate(['/client-environment/edit', reservation.id]);
  }

  deleteReservation(reservation: any): void {
    this.router.navigate(['/client-environment/edit', reservation.id]);
  }
}
