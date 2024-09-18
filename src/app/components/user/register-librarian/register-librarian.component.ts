import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import {NgIf} from "@angular/common";
import { CommonModule } from '@angular/common';


declare var bootstrap: any;

@Component({
  selector: 'app-register-librarian',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
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

  openModal() {
    if (this.registerForm.valid) {
      const modalElement = document.getElementById('confirmationModal');
      const modal = new bootstrap.Modal(modalElement!);
      modal.show();
    } else {
      this.registerForm.markAllAsTouched(); // Muestra los errores si el formulario no es válido
    }
  }

  confirmSubmission() {
    if (this.registerForm.valid) {
      console.log('Formulario confirmado:', this.registerForm.value);
      // Aquí puedes enviar la información al backend o realizar alguna acción
    }
    const modalElement = document.getElementById('confirmationModal');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal.hide();
  }
}
