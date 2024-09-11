import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [],
  templateUrl: './register-customer.component.html',
  styleUrl: './register-customer.component.css'
})
export class RegisterCustomerComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Aquí puedes añadir la lógica para enviar los datos
    }
  }

  onGoogleAuth() {
    // Lógica para autenticación con Google
    console.log('Autenticación con Google');
  }

}
