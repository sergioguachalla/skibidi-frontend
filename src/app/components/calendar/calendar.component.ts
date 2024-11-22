import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { KeycloakService } from 'keycloak-angular';
import { ReservationHistoryService } from '../../services/reservation-history.service';
import { NavbarComponent } from "../shared/navbar/navbar.component";
declare var bootstrap: any;

interface Book {
  bookName: string;
  genre: string;
  date: string;
  author?: string;
}

interface Environment {
  environment: string;
  reservationDate: string;
  clockIn: string;
  clockOut: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, FullCalendarModule, NavbarComponent],
})
export class CalendarComponent implements OnInit {
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };
  selectedEvent: any = null;

  constructor(
    private keycloakService: KeycloakService,
    private reservationHistoryService: ReservationHistoryService
  ) {}

  ngOnInit(): void {
    this.fetchCalendarData();
  }

  fetchCalendarData(): void {
    this.reservationHistoryService
      .getCalendarData(this.keycloakService.getKeycloakInstance().subject!)
      .subscribe(
        (response) => {
          if (response.successful) {
            this.mapEvents(response.data.books, response.data.environments);
          }
        },
        (error) => {
          console.error('Error fetching calendar data:', error);
        }
      );
  }

  mapEvents(books: Book[], environments: Environment[]): void {
    const bookEvents = books.map((book, index) => ({
      id: `book-${index}`,
      title: `📘 Préstamo de Libro: ${book.bookName}`,
      start: new Date(book.date).toISOString(),
      type: 'Libro',
      extendedProps: {
        genre: book.genre || null,
        author: book.author || 'Autor no especificado',
      },
    }));

    const environmentEvents = environments.map((env, index) => ({
      id: `environment-${index}`,
      title: `🏢 Reserva de Ambiente: ${env.environment}`,
      start: new Date(env.clockIn).toISOString(),
      end: new Date(env.clockOut).toISOString(),
      type: 'Ambiente',
      extendedProps: {
        reservationDate: env.reservationDate,
      },
    }));

    this.calendarOptions.events = [...bookEvents, ...environmentEvents];
  }

  handleEventClick(arg: any): void {
    const extendedProps = arg.event.extendedProps;

    if (arg.event.extendedProps.type === 'Libro') {
      this.selectedEvent = {
        type: 'Prestamo de Libro',
        title: arg.event.title,
        genre: extendedProps.genre,
        author: extendedProps.author,
        start: new Date(arg.event.start).toLocaleDateString(),
      };
    } else if (arg.event.extendedProps.type === 'Ambiente') {
      this.selectedEvent = {
        type: 'Reserva de Ambiente',
        title: arg.event.title,
        reservationDate: extendedProps.reservationDate,
        start: new Date(arg.event.start).toLocaleString(),
        end: new Date(arg.event.end).toLocaleString(),
      };
    }

    const modalElement = document.getElementById('eventModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
