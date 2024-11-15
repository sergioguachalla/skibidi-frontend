import { Component, OnInit } from '@angular/core';
import { LendBookService } from '../../services/lend-book.service';
import { LendBookDto, LendBookPageResponse } from '../../Model/lend-book.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { KeycloakService } from "keycloak-angular";
import { FormsModule } from '@angular/forms'; // Import FormsModule here
@Component({
  selector: 'app-lend-books',
  templateUrl: './lend-books.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./lend-books.component.css'],
})
export class LendBooksComponent implements OnInit {
  lendBooks: LendBookDto[] = [];
  page: number = 0;
  size: number = 5;
  sortOrder: string = 'asc';
  sortField: string = 'lendDate';  // Campo de orden inicial
  totalPages: number = 0;
  totalElements: number = 0;
  isExtensionModalOpen: boolean = false; // Controla si el modal está abierto
  selectedBook: LendBookDto | null = null;

  constructor(
    private lendBookService: LendBookService,
    private kcService: KeycloakService,
  ) {}

  ngOnInit(): void {
    this.loadLendBooks();  // Cargar los libros en la inicialización
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadLendBooks();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadLendBooks();
    }
  }

  changeSortOrder(order: string): void {
    this.sortOrder = order;
    this.loadLendBooks();
  }

  changeSortField(field: string): void {
    this.sortField = field;
    this.loadLendBooks();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Prestado';
      case 2:
        return 'Devuelto';
      case 3:
        return 'Retrasado';
      default:
        return 'Desconocido';
    }
  }

  loadLendBooks(): void {
    const kcId = this.kcService.getKeycloakInstance().subject!;
    this.lendBookService.getLendBooksByKcUuid(kcId, this.page, this.size, this.sortOrder, this.sortField).subscribe(
      (response: LendBookPageResponse) => {
        this.lendBooks = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      },
      (error) => {
        console.error('Error fetching lend books:', error);
      }
    );
  }
  requestExtension(book: LendBookDto): void {
    this.lendBookService.requestExtension(book.lendBookId).subscribe(
      (response) => {
        console.log('Extensión solicitada exitosamente:', response);
        alert('La solicitud de extensión ha sido enviada.');
        // Aquí podrías actualizar el estado del libro si el backend devuelve datos relevantes.
        this.loadLendBooks(); // Recargar la lista para reflejar cambios si aplica.
      },
      (error) => {
        console.error('Error al solicitar extensión:', error);
        alert('No se pudo procesar la solicitud de extensión. Intente nuevamente.');
      }
    );
  }
  openExtensionModal(book: LendBookDto): void {
    this.selectedBook = book; // Asigna el libro seleccionado
    this.isExtensionModalOpen = true; // Abre el modal
  }
  
  closeExtensionModal(): void {
    this.isExtensionModalOpen = false; // Cierra el modal
    this.selectedBook = null; // Limpia el libro seleccionado
  }
  
  confirmExtension(): void {
    if (!this.selectedBook) return;
  
    // Llamar al servicio para solicitar extensión
    this.lendBookService.requestExtension(this.selectedBook.lendBookId).subscribe(
      (response) => {
        console.log('Extensión solicitada exitosamente:', response);
        alert('La solicitud de extensión ha sido enviada.');
        this.closeExtensionModal(); // Cierra el modal después de confirmar
        this.loadLendBooks(); // Recarga la lista de libros prestados
      },
      (error) => {
        console.error('Error al solicitar extensión:', error);
        alert('No se pudo procesar la solicitud de extensión. Intente nuevamente.');
        this.closeExtensionModal(); // Cierra el modal en caso de error
      }
    );
  }  
}
