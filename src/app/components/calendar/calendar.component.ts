
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {CalendarUtils, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/moment";

interface Book {
  bookName: string;
  genre: string;
  date: string;
}

interface Environment {
  environment: string;
  reservationDate: string;
  clockIn: string;
  clockOut: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, FullCalendarModule],

  providers: [
    CalendarUtils, // Proveer CalendarUtils
    {
      provide: DateAdapter, // Proveer el DateAdapter
      useFactory: adapterFactory,
    },
  ],
})
export class CalendarComponent implements OnInit {
  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCalendarData();
  }

  fetchCalendarData(): void {
    const url = 'http://localhost:8091/api/v1/reservations/calendar?kcid=28708456-073d-47ab-8767-6800311e700b';
    this.http.get<any>(url).subscribe(
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
    const bookEvents = books.map((book) => ({
      title: `Libro: ${book.bookName} (${book.genre})`,
      start: book.date,
    }));

    const environmentEvents = environments.map((env) => ({
      title: `Ambiente: ${env.environment}`,
      start: env.clockIn,
      end: env.clockOut,
    }));

    this.calendarOptions.events = [...bookEvents, ...environmentEvents];
  }
}
