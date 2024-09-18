import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-ingresar-libro',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './ingresar-libro.component.html',
  styleUrls: ['./ingresar-libro.component.css']
})
export class IngresarLibroComponent {
  libroForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.libroForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      isbn: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.libroForm.valid) {
      console.log('Libro ingresado:', this.libroForm.value);
    } else {
      console.log('Formulario no válido');
      this.libroForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
    }
  }
}
