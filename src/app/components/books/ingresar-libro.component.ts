import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { GenreService } from '../../services/genre.service';

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
export class IngresarLibroComponent implements OnInit {
  libroForm: FormGroup;
  genres: any[] = [];

  constructor(private formBuilder: FormBuilder, private bookService: BookService, private genreService: GenreService) {
    this.libroForm = this.formBuilder.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      status: [true],
      registrationDate: [new Date()],
      image_url: [''],
      genre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(): void {
    this.genreService.getAllGenres().subscribe(
      (response: any) => {
        this.genres = response.data; 
      },
      (error: any) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
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
