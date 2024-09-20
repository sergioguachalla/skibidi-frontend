import { Routes } from '@angular/router';
import { RegisterCustomerComponent } from './components/user/register-customer/register-customer.component';
import { RegisterLibrarianComponent } from './components/user/register-librarian/register-librarian.component';

import { IngresarLibroComponent } from './components/books/ingresar-libro.component';
import { ViewBooksComponent } from './components/viewbook/view-books.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register-customer', component: RegisterCustomerComponent },
  { path: 'register-librarian', component: RegisterLibrarianComponent },
  { path: 'view-book', component: ViewBooksComponent },
  { path: 'ingresar-libro', component: IngresarLibroComponent },
];
