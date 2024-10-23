//TODO: refactor filter updates for better readability
import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/navbar/navbar.component';
import {BookService} from '../../services/book.service';
import {BookDto} from '../../Model/book.model';
import {GenreService} from "../../services/genre.service";
import {GenreDto} from "../../Model/genre.model";
import {FormsModule} from "@angular/forms";
import {LanguagesService} from "../../services/languages.service";
import {LanguageDto} from "../../Model/dto/languageDto";
import {EditorialService} from "../../services/editorial.service";
import {EditorialDto} from "../../Model/dto/EditorialDto";
import {ActivatedRoute, Router} from "@angular/router";

declare var bootstrap: any;
interface filtersParams {
  isAvailable: boolean | null;
  genreId: number | null;
  authorName: string | null;
  title: string | null;
  from: String | null;
  to: String | null;
  languageId: number | null;
  editorialId: number | null;

}

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})

export class ViewBooksComponent implements OnInit {

  protected genreService : GenreService = inject(GenreService);
  private languageService : LanguagesService = inject(LanguagesService);
  private editorialService : EditorialService = inject(EditorialService);

  searchTimeout: any;
  filters: WritableSignal<filtersParams> = signal({
    isAvailable: null,
    genreId: null,
    authorName: null,
    title: null,
    from: null,
    to: null,
    languageId: null,
    editorialId: null
  })

  librosFiltrados: BookDto[] = [];
  mensaje: string = '';
  genres: GenreDto[] = [];
  languages: LanguageDto[] = [];
  editorials: EditorialDto[] = [];
  bookStatuses : any[] = [{value: true, label: 'Disponible'}, {value: false, label: 'Ocupado'}];
  pages: number = 0;
  pagesArray: number[] = [];
  pageNumber = 0;
  searchQuery: string = '';
  private activeRoute: ActivatedRoute = inject(ActivatedRoute);

  //filter criteria
  availability: boolean | null = null;
  startDate: string = '';
  endDate: string = '';


  constructor(private bookService: BookService, private router: Router) {
  }

  ngOnInit() {
    this.applyFilters(0);
    this.findGenres();
    this.findLanguages();
    this.findEditorials();
      // Check if there's a page query parameter, if not, set it to 0
      this.activeRoute.queryParams.subscribe(params => {
        const page = +params['page'] || 0; // Default to page 0
        this.pageNumber = page;
        this.applyFilters(page);
      });


  }

  toggleAvailability(libro: BookDto) {
    const originalStatus = libro.status;
    const confirmMessage = libro.status ? '¿Desea marcar este libro como OCUPADO?' : '¿Desea marcar este libro como DISPONIBLE?';

    if (confirm(confirmMessage)) {
      libro.status = !originalStatus;
      const updatedBook = { ...libro };
      console.log('ID del libro:', libro.bookId);

      this.bookService.updateBook(libro.bookId!, updatedBook).subscribe(
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
  findLanguages() {
    this.languageService.findAllLanguages().subscribe(
      (response: any) => {
        console.log(response);
        this.languages = response.data;
      },
      (error: any) => {
        console.error('Error al cargar los idiomas:', error);
      }
    );
  }
  findEditorials() {
    this.editorialService.findAllEditorials().subscribe(
      (response: any) => {
        this.editorials = response.data;
      },
      (error: any) => {
        console.error('Error al cargar las editoriales:', error);
      }
    );
  }

  searchBooksByDateRange() {
    const today = new Date().toISOString().split('T')[0];

    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      if (startDate > endDate) {
        this.mensaje = 'La fecha de inicio no puede ser mayor a la fecha de fin.';
        return;
      }

      this.filters().from = formattedStartDate;
      this.filters().to = formattedEndDate;

      this.buildQueryParams(this.filters, 0);
      this.applyFilters(0);
    }
  }

  //filter bl
  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  onSearch() {
    const title = this.searchQuery.trim();
    if (title === '') {
      this.applyFilters(0);
    }
    this.filters().title = title;
    this.buildQueryParams(this.filters,0);
    this.applyFilters(0);
  }

  filterByGenreId($event: any) {
    this.filters().genreId = $event.target.value;
    this.buildQueryParams(this.filters().genreId,0);
    this.applyFilters(0);
  }

  updateAuthorSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.trim();
    if (searchTerm === '') {
      this.filters().authorName = null;
      this.applyFilters(0);
      return;
    }
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filters().authorName = searchTerm;
      this.applyFilters(0);
    }, 750);
  }

  onPageChange(page: number) {

    this.pageNumber = page-1;
    this.applyFilters(page-1);
    //update the url query params based on page


  }

  filterBooks($availabilityEvent: any) {
    const availability = $availabilityEvent.target.value;
    if ($availabilityEvent.target.value === "") {
      this.availability = null;
    }
    this.filters().isAvailable = availability;
    this.buildQueryParams(this.filters,0);
    this.applyFilters(0);
  }

  filterByLanguage($event: any) {
    if ($event.target.value === "") {
      this.filters().languageId = null;
      this.applyFilters(0);
      return;
    }
    this.filters().languageId = $event.target.value;
    this.buildQueryParams(this.filters().languageId,0);
    this.applyFilters(0);
  }
  filterByEditorial($event: any) {
    if ($event.target.value === "") {
      this.filters().editorialId = null;
      this.applyFilters(0);
      return;
    }
    this.filters().editorialId = $event.target.value;
    this.buildQueryParams(this.filters().editorialId,0);
    this.applyFilters(0);
  }

  applyFilters(page:number) {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { page},
      queryParamsHandling: 'merge', // Keeps other query parameters
    });

    const queryParams = this.buildQueryParams(this.filters(), page);
    this.bookService.findBooks(queryParams).subscribe(
      response => {
        if (response.successful) {
          if (response.data === null || response.data.content.length === 0) {
            this.librosFiltrados = [];
            this.mensaje = 'No se encontraron libros con esos criterios.';
          } else {
            this.librosFiltrados = response.data.content;
            this.pages = response.data.totalPages!;
            this.pagesArray = this.getPagesSubset(page, this.pages);
          }

        } else {
          this.mensaje = 'No se pudieron filtrar los libros.';
        }
      },
      error => {
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }

  getPagesSubset(currentPage: number, totalPages: number): number[] {
    let startPage: number;
    let endPage: number;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 3;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  buildQueryParams(filters: any, page: number): string {
    const paginationParams = `page=${page}&size=4`;
    const filterParams = Object.keys(filters)
      .filter(key => filters[key])
      .map(key => `${key}=${encodeURIComponent(filters[key])}`)
      .join('&');

    return filterParams ? `${paginationParams}&${filterParams}` : paginationParams;
  }
}
