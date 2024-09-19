import { Routes } from '@angular/router';
import { RegisterCustomerComponent } from './components/user/register-customer/register-customer.component';
import { RegisterLibrarianComponent } from './components/user/register-librarian/register-librarian.component';
import { IngresarLibroComponent } from './components/books/ingresar-libro.component';
import { ViewBooksComponent } from './components/viewbook/view-books.component';

export const routes: Routes = [
    {path: 'register-customer', component: RegisterCustomerComponent},
    {path: 'register-librarian', component: RegisterLibrarianComponent},
    {path: 'view-book', component: ViewBooksComponent},
    {path: 'ingresar-libro', component: IngresarLibroComponent}
];
