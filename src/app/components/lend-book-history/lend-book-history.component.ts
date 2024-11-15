import { Component, OnInit } from '@angular/core';
import { LendBookService } from '../../services/lend-book.service';
import { LendBookDto, LendBookPageResponse } from '../../Model/lend-book.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  sortField: string = 'lendDate';
  sortOrder: string = 'asc';
  totalPages: number = 0;
  totalElements: number = 0;
  isReturnModalOpen: boolean = false;
  isExtendDateModalOpen: boolean = false;
  newReturnDate: string = '';
  isAcceptLoanModalOpen: boolean = false;
  selectedBook: any;

  constructor(private lendBookService: LendBookService) {}

  ngOnInit(): void {
    this.loadLendBooks();
  }

  loadLendBooks(): void {
    this.lendBookService.getLendBooks(this.page, this.size, this.sortField, this.sortOrder).subscribe(
      (response: LendBookPageResponse) => {
        this.lendBooks = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        console.log('Libros cargados:', this.lendBooks);
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
    this.sortField = field;
    this.loadLendBooks();
  }

  // Cambiar el orden ascendente/descendente
  changeSortOrder(order: string): void {
    this.sortOrder = order;
    this.loadLendBooks();
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
  getStatusText2(request_extension: number): string {
    switch (request_extension) {
      case 0:
        return 'sin solicitud';
      case 1:
        return 'solicitado';
      default:
        return 'Desconocido';
    }
  }

  // Métodos para el manejo de los modales
  acceptLoan(book: any): void {
    // Aquí solo lo dejaremos vacío por ahora, para probar los modales
  }
  
  markAsReturned(book: any): void {
    this.selectedBook = book;
    this.isReturnModalOpen = true;
  }
  
  extendReturnDate(book: any): void {
    this.selectedBook = book;
    this.isExtendDateModalOpen = true;
  }
  
  closeReturnModal(): void {
    this.isReturnModalOpen = false;
  }
  
  confirmReturn(): void {
    if (this.selectedBook && this.selectedBook.lendBookId) { // Usa lendBookId aquí
      console.log(`Marcando como devuelto el libro con ID ${this.selectedBook.lendBookId}`);
      this.lendBookService.markAsReturned(this.selectedBook.lendBookId).subscribe(
        (response) => {
          console.log('Libro marcado como devuelto:', response);
          this.closeReturnModal();
          this.loadLendBooks();  // Recargar la lista para actualizar el estado
        },
        (error) => {
          console.error('Error al marcar el libro como devuelto:', error);
        }
      );
    }
  }  
  closeExtendDateModal(): void {
    this.isExtendDateModalOpen = false;
  }
  
  confirmExtendDate(): void {
    if (!this.newReturnDate) {
        alert('Por favor, selecciona una fecha.');
        return;
    }

    const today = new Date();
    const selectedDate = new Date(this.newReturnDate);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('No puedes seleccionar una fecha anterior a hoy.');
        return;
    }

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 10);

    if (selectedDate > maxDate) {
        alert('No puedes seleccionar una fecha mayor a 10 días desde hoy.');
        return;
    }

    console.log(`Extendiendo fecha de retorno para el libro con ID ${this.selectedBook.lendBookId} a ${this.newReturnDate}`);

    const dateWithTime = new Date(this.newReturnDate);
    dateWithTime.setHours(21, 0, 0, 0);

    this.lendBookService.extendReturnDate(this.selectedBook.lendBookId, dateWithTime).subscribe(
        (response) => {
            console.log('Fecha de retorno extendida:', response);
            this.closeExtendDateModal();
            this.loadLendBooks();
        },
        (error) => {
            console.error('Error al extender la fecha de retorno:', error);
        }
    );
}

       

  openAcceptLoanModal(book: any): void {
    this.selectedBook = book;
    this.isAcceptLoanModalOpen = true;
  }

  closeAcceptLoanModal(): void {
    this.isAcceptLoanModalOpen = false;
  }

  confirmAcceptLoan(): void {
    this.acceptLoan(this.selectedBook);
    this.closeAcceptLoanModal();
  }
}
