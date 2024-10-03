import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/navbar/navbar.component';
import {BookService} from '../../services/book.service';
import {FormsModule} from '@angular/forms';
import {BookDto} from '../../Model/book.model';
import {GenreService} from "../../services/genre.service";
import {GenreDto} from "../../Model/genre.model";
import {filter} from "rxjs";
declare var bootstrap: any;

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})

export class ViewBooksComponent implements OnInit {

  protected genreService: GenreService = inject(GenreService);

  librosFiltrados: BookDto[] = [];
  mensaje: string = '';
  genres: GenreDto[] = [];
  bookStatuses: any[] = [{value: true, label: 'Disponible'}, {value: false, label: 'Ocupado'}];
  pages: number = 0;
  pagesArray: number[] = [];
  searchQuery: string = '';

  // Variables para las fechas de inicio y fin
  startDate: string = '';
  endDate: string = '';

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
          // Manejo de totalPages, asignando 0 si es null
          this.pages = response.data.totalPages ?? 0; // Usando el operador de coalescencia nula
          this.pagesArray = Array.from({ length: this.pages }, (_, i) => i + 1);
  
          // Asegúrate de que 'content' esté disponible
          if (response.data.content) {
            this.librosFiltrados = response.data.content.map((libro, index) => ({
              ...libro,
              id: index + 1 // Puedes usar un ID único si ya lo tienes en 'libro'
            }));
            console.log('Libros cargados:', this.librosFiltrados);
            this.mensaje = 'Libros recuperados exitosamente!';
          } else {
            console.warn('No hay contenido disponible en la respuesta.');
            this.mensaje = 'No hay libros disponibles.';
          }
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
  
    
  // Modifica esta función para que envíe el rango de fechas
  searchBooksByDateRange() {
    if (this.startDate && this.endDate) {
      // Realiza la llamada al servicio con el rango de fechas
      this.bookService.getAllBooksFiltered(0, 10, undefined, this.startDate, this.endDate, undefined).subscribe(
        (response: any) => {
          if (response.successful) {
            this.librosFiltrados = response.data.content.map((libro: BookDto, index: number) => ({
              ...libro,
              id: index + 1
            }));
            this.mensaje = 'Libros filtrados por rango de fechas!';
          } else {
            this.mensaje = 'No se encontraron libros en el rango de fechas proporcionado.';
          }
        },
        (error: any) => {
          console.error('Error al conectar con el API:', error);
          this.mensaje = 'Ocurrió un error al conectar con el API.';
        }
      );
    } else {
      this.mensaje = 'Por favor, selecciona un rango de fechas válido.';
    }
  }
  
  onSearch() {
    const title = this.searchQuery.trim();

    if (title === '') {
      this.loadBooks();
    } else {
      this.bookService.searchBooksByTitle(title).subscribe(
        response => {
          if (response.successful) {
            this.librosFiltrados = Array.isArray(response.data)
              ? response.data
              : response.data.content || [];

            if (this.librosFiltrados.length === 0) {
              this.mensaje = 'No se encontraron libros con ese título.';
            } else {
              this.mensaje = 'Libros encontrados exitosamente!';
            }
          } else {
            this.mensaje = 'No se encontraron libros.';
          }
        },
        error => {
          console.error('Error al buscar libros por título:', error);
          this.mensaje = 'Ocurrió un error al buscar libros.';
        }
      );
    }
  }

  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  toggleAvailability(libro: BookDto) {
    const originalStatus = libro.status;
    const confirmMessage = libro.status ? '¿Desea marcar este libro como OCUPADO?' : '¿Desea marcar este libro como DISPONIBLE?';

    if (confirm(confirmMessage)) {
      libro.status = !originalStatus;
      const updatedBook = {...libro};
      console.log('ID del libro:', libro.id);

      this.bookService.updateBook(libro.id, updatedBook).subscribe(
        response => {
          const modalElement = document.getElementById('successModal');
          const modal = new bootstrap.Modal(modalElement!);
          modal.show();
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

  updateAuthorSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      if (input.value === '') {
        this.loadBooks();
        return;
      }
      this.bookService.findBooksByAuthor(input.value).subscribe(
        response => {
          if (response.successful) {
            if (response.data == null) {
              this.librosFiltrados = [];
              this.mensaje = 'No se encontraron libros con ese autor.';
            }
            if (response.data != null) {
              this.librosFiltrados = response.data.content.map((libro, index) => ({
                ...libro,
                id: index + 1
              }));
            }
          } else {
            console.error('Error al filtrar los libros por autor:', response.message);
          }
        },
        error => {
          console.error('Error al conectar con el API:', error);
          this.mensaje = 'Ocurrió un error al conectar con el API.';
        }
      );
    }, 750);
  }

  filterByAvailability($event: any) {
    let status = $event.target.value;
    this.bookService.filterBooksByAvailability(status).subscribe(
      response => {
        if (response.data === null) {
          this.librosFiltrados = [];
          this.mensaje = 'No se encontraron libros con los filtros seleccionados';
        }
        if (response.successful) {
          this.librosFiltrados = response.data.content.map((libro, index) => ({
            ...libro,
            id: index + 1
          }));
          this.mensaje = 'Libros filtrados por disponibilidad exitosamente!';
        }
      },
      error => {
        console.error('Error al conectar con el API:', error);
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }

  onPageChange(page: number) {
    this.bookService.getAllBooks2(page - 1).subscribe(
      response => {
        if (response.successful) {
          this.librosFiltrados = response.data.content.map((libro, index) => ({
            ...libro,
            id: index + 1
          }));
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

  protected readonly filter = filter;
}
