import { Component, OnInit } from '@angular/core';
import { LendBookService } from '../../services/lend-book.service';
import { LendBookDto, LendBookPageResponse } from '../../Model/lend-book.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule here

@Component({
  selector: 'app-lend-book-history',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './lend-book-history.component.html',
  styleUrls: ['./lend-book-history.component.css']
})
export class LendBookHistoryComponent implements OnInit {
  lendBooks: LendBookDto[] = [];
  page: number = 0;
  size: number = 5;
  sortField: string = 'lendDate'; // Campo de ordenamiento inicial
  sortOrder: string = 'asc'; // Orden inicial
  totalPages: number = 0;
  totalElements: number = 0;
  // Propiedades necesarias para los modales
  isReturnModalOpen: boolean = false;
  isExtendDateModalOpen: boolean = false;
  newReturnDate: string = '';
  isAcceptLoanModalOpen: boolean = false;
  selectedBook: any;

  acceptLoan(book: any): void {
    // Aquí solo lo dejaremos vacío por ahora, para probar los modales
  }
  
  markAsReturned(book: any): void {
    this.isReturnModalOpen = true;  // Abrir modal para marcar como devuelto
  }
  
  extendReturnDate(book: any): void {
    this.isExtendDateModalOpen = true;  // Abrir modal para extender fecha de retorno
  }
  
  closeReturnModal(): void {
    this.isReturnModalOpen = false;
  }
  
  confirmReturn(): void {
    this.isReturnModalOpen = false;  // Confirmar devolución y cerrar modal
  }
  
  closeExtendDateModal(): void {
    this.isExtendDateModalOpen = false;
  }
  
  confirmExtendDate(): void {
    this.isExtendDateModalOpen = false;  // Confirmar extensión y cerrar modal
  }
  // Método para abrir el modal de confirmación
openAcceptLoanModal(book: any): void {
  this.selectedBook = book;
  this.isAcceptLoanModalOpen = true;
}

// Método para cerrar el modal de confirmación
closeAcceptLoanModal(): void {
  this.isAcceptLoanModalOpen = false;
}

// Método para confirmar y aceptar el préstamo
confirmAcceptLoan(): void {
  // Lógica para aceptar el préstamo
  this.acceptLoan(this.selectedBook);
  this.closeAcceptLoanModal();  // Cierra el modal
}

  constructor(
    private lendBookService: LendBookService,
  ) {}

  ngOnInit(): void {
    this.loadLendBooks();  // Cargar los libros en la inicialización
  }

  loadLendBooks(): void {
    this.lendBookService.getLendBooks(this.page, this.size, this.sortField, this.sortOrder).subscribe(
      (response: LendBookPageResponse) => {
        this.lendBooks = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Libros cargados:', this.lendBooks); // Verificar datos cargados
      },
      (error) => {
        console.error('Error fetching lend books:', error);
      }
    );
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

  // Cambiar el campo de ordenamiento
  changeSortField(field: string): void {
    this.sortField = field;  // Cambiar el campo de ordenamiento
    this.loadLendBooks(); // Recargar los libros con el nuevo campo de orden
  }

  // Cambiar el orden ascendente/descendente
  changeSortOrder(order: string): void {
    this.sortOrder = order;  // Cambiar el orden
    this.loadLendBooks(); // Recargar los libros con el nuevo orden
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'En espera';
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
}
