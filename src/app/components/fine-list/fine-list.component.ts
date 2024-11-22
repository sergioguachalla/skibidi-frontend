import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { FinesService } from "../../services/fines.service";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { UserClientService } from '../../services/userclient.service';

@Component({
  selector: 'app-fine-list',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './fine-list.component.html',
  styleUrl: './fine-list.component.css'
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
  selectedFine: any;  // Nueva variable para guardar el "fine" seleccionado

  private fineService: FinesService = inject(FinesService);
  private userService: UserClientService = inject(UserClientService);

  constructor() {}

  ngOnInit(): void {
    this.findAllFines();
  }

  findAllFines(page: number = 0) {
    this.fineService.findAll(page, 5, null, null).subscribe((response) => {
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
    this.selectedFine = fine;  // Guarda el "fine" seleccionado
    this.isConfirmModalOpen = true;
    console.log("Modal abierto para el usuario", fine.userKcId); // Verifica si se abre
  }
  
  closeConfirmModal(): void {
    this.selectedUserId = null;
    this.selectedFine = null;  // Limpiar la selección del "fine"
    this.isConfirmModalOpen = false;
  }
  
  confirmBlock(): void {
    console.log("Confirmación de bloqueo iniciada");
    if (this.selectedFine) {
      this.userService.changeBorrowPermission(this.selectedFine.userKcId).subscribe(
        () => {
          let message = this.selectedFine.canBorrowBooks 
                        ? 'El permiso para realizar préstamos ha sido bloqueado para el usuario.'
                        : 'El permiso para realizar préstamos ha sido desbloqueado para el usuario.';
          console.log('Permiso actualizado para el usuario:', this.selectedFine.userKcId);
          alert(message);
          this.findAllFines(); // Actualiza la lista
          this.closeConfirmModal();
        },
        (error) => {
          console.error('Error al cambiar los permisos:', error);
          alert('No se pudo cambiar el permiso. Intenta de nuevo.');
          this.closeConfirmModal();
        }
      );
    }
  }
}
