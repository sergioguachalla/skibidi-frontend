import { Routes } from '@angular/router';
import { RegisterCustomerComponent } from './components/user/register-customer/register-customer.component';
import { RegisterLibrarianComponent } from './components/user/register-librarian/register-librarian.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { IngresarLibroComponent } from './components/books/ingresar-libro.component';
import { ViewBooksComponent } from './components/viewbook/view-books.component';
import { ReservationComponent } from './components/environmentrequest/environment-reservation.component';
import {EditUserInformationComponent} from "./components/edit-user-information/edit-user-information.component";
import {EnvironmentClientComponent} from "./components/environment-client/environment-client.component";
import {ReservationsComponent} from "./components/reservations/reservations.component";
import{ReservationHistoryComponent} from "./components/reservation-history/reservation-history.component"
import {EditReservationComponent} from "./components/edit-reservation/edit-reservation.component";
import {UpdatePasswordComponent} from "./components/update-password/update-password.component";

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    {path: 'register-customer', component: RegisterCustomerComponent},
    {path: 'register-librarian', component: RegisterLibrarianComponent},
    {path: 'books', component: ViewBooksComponent},
    {path: 'ingresar-libro', component: IngresarLibroComponent},
    {path: 'reservation-enviroment', component: ReservationComponent},
    {path: 'client-environment', component: EnvironmentClientComponent },
    {path: 'reservations', component: ReservationsComponent},
    {path: 'my-information', component: EditUserInformationComponent},
    {path: 'client-environment', component: EnvironmentClientComponent },
    {path: 'reservation-history', component: ReservationHistoryComponent },
    {path: 'client-environment/edit/:id', component: EditReservationComponent},
    {path: 'update-password', component: UpdatePasswordComponent},
];
