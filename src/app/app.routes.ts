import { Routes } from '@angular/router';
import { RegisterCustomerComponent } from './components/user/register-customer/register-customer.component';
import { RegisterLibrarianComponent } from './components/user/register-librarian/register-librarian.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { IngresarLibroComponent } from './components/books/ingresar-libro.component';
import { ViewBooksComponent } from './components/viewbook/view-books.component';

import { ReservationComponent } from './components/environmentrequest/environment-reservation.component';
import {EnvironmentClientComponent} from "./components/environment-client/environment-client.component";
import {ReservationsComponent} from "./components/reservations/reservations.component";

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    {path: 'register-customer', component: RegisterCustomerComponent},
    {path: 'register-librarian', component: RegisterLibrarianComponent},
    {path: 'view-book', component: ViewBooksComponent},
    {path: 'ingresar-libro', component: IngresarLibroComponent},
    {path: 'reservation-enviroment', component: ReservationComponent},
    {path: 'client-environment', component: EnvironmentClientComponent },
  {path: 'reservations', component: ReservationsComponent}

];
