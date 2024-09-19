import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.css']
})
export class RegisterCustomerComponent {
  registerForm: FormGroup;
  departamentos = [
    { value: 'LP', label: 'La Paz' },
    { value: 'SCZ', label: 'Santa Cruz' },
    { value: 'CBB', label: 'Cochabamba' },
    { value: 'OR', label: 'Oruro' },
    { value: 'PT', label: 'Potosí' },
    { value: 'TJ', label: 'Tarija' },
    { value: 'CH', label: 'Chuquisaca' },
    { value: 'BN', label: 'Beni' },
    { value: 'PD', label: 'Pando' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, ]], // ejemplo de validación para números de celular de 10 dígitos
      direccion: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      ci: ['', Validators.required],
      departamento: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator // Validador personalizado para confirmar que las contraseñas coinciden
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  openModal() {
    if (this.registerForm.valid) {
      const modalElement = document.getElementById('confirmationModal');
      const modal = new bootstrap.Modal(modalElement!);
      modal.show();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmSubmission() {
    if (this.registerForm.valid) {
      console.log('Formulario confirmado:', this.registerForm.value);
    }
    const modalElement = document.getElementById('confirmationModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }
}
