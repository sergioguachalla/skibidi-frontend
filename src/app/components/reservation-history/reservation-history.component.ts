import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [
    CommonModule,NavbarComponent
    ],
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.css']
})
export class ReservationHistoryComponent {
  reservations = [
    {
      clientId: '7aefdaa3-162f-42cf-bef0-ee343f84bbdb',
      environmentId: 2,
      reservationDate: '2024-10-17',
      clockIn: '2024-10-17T10:00:00',
      clockOut: '2024-10-17T11:00:00',
      purpose: 'sala de reuniones'
    },
    {
      clientId: '5dfg773-762f-47cf-bef0-ee343f84aaea',
      environmentId: 3,
      reservationDate: '2024-10-18',
      clockIn: '2024-10-18T12:00:00',
      clockOut: '2024-10-18T13:00:00',
      purpose: 'sesión de estudio'
    }
  ];
}
