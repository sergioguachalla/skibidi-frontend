import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { BookDto } from '../../Model/book.model';
import {GenreService} from "../../services/genre.service";
import {GenreDto} from "../../Model/genre.model";


@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {

  protected genreService : GenreService = inject(GenreService);

  librosFiltrados: BookDto[] = [];
  mensaje: string = '';
  genres: GenreDto[] = [];


  constructor(private bookService: BookService) {
  }

  ngOnInit() {
    this.loadBooks();
    this.findGenres();

  }

  loadBooks() {
    this.bookService.getAllBooks().subscribe(
      response => {
        console.log('Respuesta del API:', response);
        if (response.successful) {
          // Acceder a response.data.content
          this.librosFiltrados = response.data.content.map((libro, index) => ({
            ...libro,
            id: index + 1  // Puedes manejar el ID como lo necesites
          }));
          console.log('Libros cargados:', this.librosFiltrados);
          this.mensaje = 'Libros recuperados exitosamente!';
        } else {
          console.error('Error al cargar los libros:', response.message);
          this.mensaje = 'No se pudieron recuperar los libros.';
        }
      },
      error => {
        console.error('Error al conectar con el API:', error);
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }

  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Buscar:', input.value);
  }

  onSearch() {
    console.log('Búsqueda en curso...');
  }

  toggleAvailability(libro: BookDto) {
    const originalStatus = libro.status;
    const confirmMessage = libro.status ? '¿Desea marcar este libro como OCUPADO?' : '¿Desea marcar este libro como DISPONIBLE?';

    if (confirm(confirmMessage)) {
      libro.status = !originalStatus;


      const updatedBook = { ...libro };

      console.log('ID del libro:', libro.id);

      this.bookService.updateBook(libro.id, updatedBook).subscribe(
        response => {
          console.log('Estado actualizado:', response);
          this.mensaje = 'Estado del libro actualizado exitosamente!';
        },
        error => {
          console.error('Error al actualizar el libro:', error);
          libro.status = originalStatus;
          this.mensaje = 'Error al actualizar el estado del libro.';
        }
      );
    } else {
      libro.status = originalStatus;
    }
  }

  findGenres() {
    this.genreService.getAllGenres().subscribe(
      (response: any) => {
        this.genres = response.data;
      },
      (error: any) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
  }

  filterByGenreId($event: any) {
    let genreId = $event.target.value;
    this.bookService.findBooksByGenre(genreId).subscribe(
      response => {
        if (response.successful) {
          this.librosFiltrados = response.data.content.map((libro, index) => ({
            ...libro,
            id: index + 1
          }));
          this.mensaje = 'Libros filtrados por género exitosamente!';
        } else {
          console.error('Error al filtrar los libros por género:', response.message);
          this.mensaje = 'No se pudieron filtrar los libros por género.';
        }
      },
      error => {
        console.error('Error al conectar con el API:', error);
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }

}
