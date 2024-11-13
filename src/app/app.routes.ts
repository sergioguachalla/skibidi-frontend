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
import {ForbiddenComponent} from "./components/shared/forbidden/forbidden.component";
import {AuthGuard} from "./guards/auth.guard";
import {FineListComponent} from "./components/fine-list/fine-list.component";
<<<<<<< HEAD
=======
import { LendBooksComponent } from './components/lend-books/lend-books.component';
import { LendBookHistoryComponent } from './components/lend-book-history/lend-book-history.component';
import {ClientListComponent} from "./components/client-list/client-list.component";
>>>>>>> c698002 (add client list component)

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    {path: 'register-customer', component: RegisterCustomerComponent},
    {path: 'register-librarian', component: RegisterLibrarianComponent},
    {path: 'books', component: ViewBooksComponent},
    {path: 'ingresar-libro', component: IngresarLibroComponent},
    {path: 'reservation-enviroment', component: ReservationComponent, canActivate: [AuthGuard], data:{roles:['MAKE_RESERVATION']}},
    {path: 'client-environment', component: EnvironmentClientComponent },
    {path: 'reservations', component: ReservationsComponent},
    {path: 'my-information', component: EditUserInformationComponent},
    {path: 'client-environment', component: EnvironmentClientComponent },
    {path: 'reservation-history', component: ReservationHistoryComponent },
    {path: 'client-environment/edit/:id', component: EditReservationComponent},
    {path: 'update-password', component: UpdatePasswordComponent},
    {path: 'forbidden', component: ForbiddenComponent},
<<<<<<< HEAD
    {path: 'fines', component: FineListComponent}
=======
  //TODO: Change the role to 'VIEW_FINES' when the role is created
    {path: 'fines', component: FineListComponent, canActivate: [AuthGuard], data:{roles:['MAKE_RESERVATION']}},
    { path: 'lend-client-history', component: LendBooksComponent },
    { path: 'lend-history', component: LendBookHistoryComponent },
    {path: 'clients', component: ClientListComponent}

>>>>>>> bf2c7e8 (update guard in fines component)
];
