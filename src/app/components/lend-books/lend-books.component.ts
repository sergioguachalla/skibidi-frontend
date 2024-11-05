import { Component, OnInit } from '@angular/core';
import { LendBookService } from '../../services/lend-book.service';
import { LendBookDto, LendBookPageResponse } from '../../Model/lend-book.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: 'app-lend-books',
  templateUrl: './lend-books.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule
  ],
  styleUrls: ['./lend-books.component.css'],
})
export class LendBooksComponent implements OnInit {
  lendBooks: LendBookDto[] = [];
  page: number = 0;
  size: number = 5;
  sortOrder: string = 'asc'; // Orden inicial
  totalPages: number = 0;
  totalElements: number = 0;

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

  // Cambiar el orden
  changeSortOrder(order: string): void {
    this.sortOrder = order;  // Cambiar el orden
    console.log(`Ordenamiento cambiado a: ${order}`); // Log para ver el cambio
    this.loadLendBooks(); // Recargar los libros con el nuevo orden
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
    this.lendBookService.getLendBooksByKcUuid(kcId, this.page, this.size, this.sortOrder).subscribe(
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
}
