import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-register-librarian',
  standalone: true,
    imports: [NavbarComponent, FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './register-librarian.component.html',
  styleUrl: './register-librarian.component.css'
})
export class RegisterLibrarianComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
    } else {
      console.log('Formulario no válido');
      this.registerForm.markAllAsTouched(); // Esto marca todos los campos como tocados para mostrar los errores
    }
  }
}
