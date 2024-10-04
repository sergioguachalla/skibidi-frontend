import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { BookDto } from '../../Model/book.model';
import { GenreService } from "../../services/genre.service";
import { GenreDto } from "../../Model/genre.model";
import { filter } from "rxjs";

declare var bootstrap: any;

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})

export class ViewBooksComponent implements OnInit {

  protected genreService: GenreService = inject(GenreService);

  librosFiltrados: BookDto[] = [];
  mensaje: string = '';
  genres: GenreDto[] = [];
  bookStatuses: any[] = [{ value: true, label: 'Disponible' }, { value: false, label: 'Ocupado' }];
  pages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  maxPagesToShow: number = 5;
  pagesArray: number[] = [];
  searchQuery: string = '';

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.loadBooks();
    this.findGenres();
  }

  loadBooks() {
    this.bookService.getAllBooks2(this.currentPage - 1).subscribe(
      response => {
        if (response.successful) {
          this.pages = response.data.totalPages!;
          this.librosFiltrados = response.data.content.map((libro, index) => ({
            ...libro,
            id: index + 1
          }));
          this.pagesArray = this.calculatePaginationPages();
          this.mensaje = 'Libros recuperados exitosamente!';
        } else {
          this.mensaje = 'No se pudieron recuperar los libros.';
        }
      },
      error => {
        console.error('Error al conectar con el API:', error);
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }


  // Calcula el rango de páginas visibles basado en la página actual
  calculatePaginationPages(): number[] {
    const start = Math.max(1, this.currentPage - Math.floor(this.maxPagesToShow / 2));
    const end = Math.min(this.pages, start + this.maxPagesToShow - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // Cambia a la página seleccionada
  onPageChange(page: number) {
    if (page >= 1 && page <= this.pages) {
      this.currentPage = page;
      this.loadBooks();
    }
  }

  // Navega a la página anterior
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  // Navega a la página siguiente
  goToNextPage() {
    if (this.currentPage < this.pages) {
      this.onPageChange(this.currentPage + 1);
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
      const updatedBook = { ...libro };

      this.bookService.updateBook(libro.id, updatedBook).subscribe(
        response => {
          const modalElement = document.getElementById('successModal');
          const modal = new bootstrap.Modal(modalElement!);
          modal.show();
        },
        error => {
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
          this.mensaje = 'No se pudieron filtrar los libros por género.';
        }
      },
      error => {
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
            this.librosFiltrados = response.data?.content?.map((libro, index) => ({
              ...libro,
              id: index + 1
            })) || [];
            this.mensaje = this.librosFiltrados.length === 0 ? 'No se encontraron libros con ese autor.' : '';
          }
        },
        error => {
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
        } else {
          this.librosFiltrados = response.data.content.map((libro, index) => ({
            ...libro,
            id: index + 1
          }));
          this.mensaje = 'Libros filtrados por disponibilidad exitosamente!';
        }
      },
      error => {
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }

  protected readonly filter = filter;
}
