import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';


@Component({
  selector: 'app-register-librarian',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './register-librarian.component.html',
  styleUrl: './register-librarian.component.css'
})
export class RegisterLibrarianComponent {
  registerLibrarianForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerLibrarianForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      numeroEmpleado: ['', Validators.required],
      departamento: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerLibrarianForm.valid) {
      console.log(this.registerLibrarianForm.value);
    }
  }

  onGoogleAuth() {
    console.log('Autenticación con Google');
  }
}
