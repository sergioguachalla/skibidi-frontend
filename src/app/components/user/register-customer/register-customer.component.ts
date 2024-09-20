

import {Component, inject} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {PersonDto} from "../../../model/dto/PersonDto";
import {UserDto} from "../../../model/dto/UserDto";
import {UserRegistrationDto} from "../../../model/dto/UserRegistrationDto";
import {CustomerServiceService} from "../../../services/customer-service.service";
import {BehaviorSubject} from "rxjs";

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
  loading$ = new BehaviorSubject<boolean>(false);
  success$ = new BehaviorSubject<boolean | null>(null);
  customerService: CustomerServiceService= inject(CustomerServiceService);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, ]],
      direccion: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      ci: ['', Validators.required],
      departamento: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
      celular: ['', [Validators.required, ]], // ejemplo de validación para números de celular de 10 dígitos
      direccion: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
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
      this.loading$.next(true); // Cambiamos el estado a 'loading'
      this.success$.next(null);

      const modalElement = document.getElementById('statusModal');
      const modal = new bootstrap.Modal(modalElement!);
      modal.show();

      const personDto = {
        name: this.registerForm.get('nombres')?.value,
        lastName: this.registerForm.get('apellidos')?.value,
        idNumber: this.registerForm.get('ci')?.value,
        expedition: this.registerForm.get('departamento')?.value,
        address: this.registerForm.get('direccion')?.value
      };

      const userDto = {
        name: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      const userRegistrationDto = {
        personDto: personDto,
        userDto: userDto
      };
      setTimeout(() => {
        this.customerService.registerCustomer(userRegistrationDto).subscribe(
          response => {
            this.loading$.next(false);
            this.success$.next(true);

            setTimeout(() => {
              modal.hide();
            }, 2000);
          },
          error => {
            this.loading$.next(false);
            this.success$.next(false);
          }
        );
      }, 1000);
    }

    const confirmationModalElement = document.getElementById('confirmationModal');
    const confirmationModal = bootstrap.Modal.getInstance(confirmationModalElement!);
    confirmationModal.hide();
  }


}
