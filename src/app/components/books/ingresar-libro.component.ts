import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  libroIngresadoExitosamente: boolean = false; // Variable para el mensaje de éxito

  constructor(private formBuilder: FormBuilder, private bookService: BookService, private genreService: GenreService) {
    this.libroForm = this.formBuilder.group({
      title: ['', Validators.required],
      isbn: ['', Validators.required],
      status: [true],
      registrationDate: [new Date()],
      image_url: [''],
      genreId: ['', Validators.required], // Cambiado a genreId
      authors: this.formBuilder.array([this.createAuthorField()])
    });
  }

  ngOnInit(): void {
    this.getGenres();
  }

  createAuthorField(): FormGroup {
    return this.formBuilder.group({
      author: ['', Validators.required]
    });
  }

  addAuthorField(): void {
    this.authors.push(this.createAuthorField());
  }

  removeAuthorField(index: number): void {
    this.authors.removeAt(index);
  }

  get authors(): FormArray {
    return this.libroForm.get('authors') as FormArray;
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
      
      const bookData = {
        ...this.libroForm.value,
        authors: this.authors.controls.map(control => control.value.author)
      };

      console.log('Datos del libro que se envían:', bookData);

      this.bookService.createBook(bookData).subscribe(
        response => {
          console.log('Libro registrado exitosamente:', response);
          this.libroIngresadoExitosamente = true; // Mostrar el mensaje de éxito
          this.libroForm.reset(); // Opcional: resetear el formulario
        },
        error => {
          console.error('Error al registrar el libro:', error);
          this.libroIngresadoExitosamente = false; 
        }
      );
    } else {
      console.log('Formulario no válido');
      this.libroForm.markAllAsTouched();
    }
  }
}
