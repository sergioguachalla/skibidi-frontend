import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BookService } from '../../services/book.service'; // Importamos el servicio
@Component({
  selector: 'app-ingresar-libro',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './ingresar-libro.component.html',
  styleUrls: ['./ingresar-libro.component.css']
})
export class IngresarLibroComponent {
  libroForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private bookService: BookService) {
    this.libroForm = this.formBuilder.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      status: [true],
      registrationDate: [new Date()],
      image_url: ['']
    });
  }

  onSubmit() {
    if (this.libroForm.valid) {
      this.libroForm.patchValue({ registrationDate: new Date() });
      console.log('Datos del libro que se envían:', this.libroForm.value);

      this.bookService.createBook(this.libroForm.value).subscribe(
        response => {
          console.log('Libro registrado exitosamente:', response);
        },
        error => {
          console.error('Error al registrar el libro:', error);
        }
      );
    } else {
      console.log('Formulario no válido');
      this.libroForm.markAllAsTouched();
    }
  }
}
