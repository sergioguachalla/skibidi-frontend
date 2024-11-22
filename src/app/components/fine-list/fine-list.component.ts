import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { FinesService } from "../../services/fines.service";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserClientService } from '../../services/userclient.service';

@Component({
  selector: 'app-fine-list',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './fine-list.component.html',
  styleUrls: ['./fine-list.component.css']
})
export class FineListComponent implements OnInit {
  fines: any = [];
  fineDetail: any;
  currentPage: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];
  isModalOpen: boolean = false;
  isConfirmModalOpen: boolean = false;
  selectedUserId: string | null = null;
  selectedFine: any;
  startDate: any;
  endDate: any;

  private fineService: FinesService = inject(FinesService);
  private userService: UserClientService = inject(UserClientService);

  constructor() {}

  ngOnInit(): void {
    this.findAllFines();
  }

  findAllFines(page: number = 0) {
    this.fineService.findAll(page, 5, null, null, null, null).subscribe((response) => {
      this.fines = response.data.content;
      this.currentPage = response.data.pageable.pageNumber;
      this.totalPages = response.data.totalPages;
      this.pagesArray = this.getPagesSubset(this.currentPage, this.totalPages);
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.findAllFines(page);
  }

  getPagesSubset(current: number, total: number): number[] {
    const maxVisiblePages = 5;
    let startPage = Math.max(current - Math.floor(maxVisiblePages / 2), 0);
    const endPage = Math.min(startPage + maxVisiblePages, total);

    if (endPage - startPage < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages, 0);
    }

    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
  }

  showFineDetail(fineId: number) {
    this.showModal();
    this.fineService.findFineDetail(fineId).subscribe((response) => {
      console.log(response);
      this.fineDetail = response.data;
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  showModal(): void {
    this.isModalOpen = true;
  }

  openConfirmModal(fine: any): void {
    this.selectedFine = fine;
    this.isConfirmModalOpen = true;
    console.log("Modal abierto para el usuario", fine.userKcId);
  }

  closeConfirmModal(): void {
    this.selectedUserId = null;
    this.selectedFine = null;
    this.isConfirmModalOpen = false;
  }

  confirmBlock(): void {
    if (this.selectedFine) {
      if (this.selectedFine.typeFine === 'Daño o Pérdida de Material') {
        this.userService.blockUser(this.selectedFine.userKcId).subscribe({
          next: () => {
            const message = this.selectedFine.isBlocked
              ? 'El usuario ha sido bloqueado exitosamente.'
              : 'El usuario ha sido desbloqueado exitosamente.';
            alert(message);
            this.findAllFines();
            this.closeConfirmModal();
          },
          error: (err) => {
            console.error('Error al bloquear/desbloquear al usuario:', err);
            alert('No se pudo completar la acción. Intenta de nuevo.');
            this.closeConfirmModal();
          },
        });
      } else {
        this.userService.changeBorrowPermission(this.selectedFine.userKcId).subscribe({
          next: () => {
            const message = this.selectedFine.canBorrowBooks
              ? 'El permiso para realizar préstamos ha sido bloqueado para el usuario.'
              : 'El permiso para realizar préstamos ha sido desbloqueado para el usuario.';
            alert(message);
            this.findAllFines();
            this.closeConfirmModal();
          },
          error: (err) => {
            console.error('Error al cambiar los permisos:', err);
            alert('No se pudo completar la acción. Intenta de nuevo.');
            this.closeConfirmModal();
          },
        });
      }
    }
  }

  filterFines() {
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      this.fineService.findAll(this.currentPage, 5, null, null, formattedStartDate, formattedEndDate).subscribe((response) => {
        this.fines = response.data.content;
        this.currentPage = response.data.pageable.pageNumber;
        this.totalPages = response.data.totalPages;
        this.pagesArray = this.getPagesSubset(this.currentPage, this.totalPages);
      });
    }
  }

  clearFilter() {
    this.startDate = null;
    this.endDate = null;
    this.findAllFines();
  }

  payFine(fineId: number) {
    if (confirm('Desea registrar el pago de la multa?')) {
      this.fineService.payFine(fineId).subscribe(() => {
        this.findAllFines();
      });
    }
  }
}
