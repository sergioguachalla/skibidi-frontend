import { Routes } from '@angular/router';
import { RegisterCustomerComponent } from './components/user/register-customer/register-customer.component';
import { RegisterLibrarianComponent } from './components/user/register-librarian/register-librarian.component';

export const routes: Routes = [
    {path: 'register-customer', component: RegisterCustomerComponent},
    {path: 'register-librarian', component: RegisterLibrarianComponent}
];
