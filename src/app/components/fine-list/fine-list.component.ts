import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FinesService} from "../../services/fines.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {toArray} from "rxjs";
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
  showFineDetail(fineId: number){
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

  blockBorrowingPermission(userId: string): void {
    // Implementar lógica para bloquear los préstamos
    this.userService.changeBorrowPermission(userId).subscribe(
      () => {
        alert('El permiso para realizar préstamos ha sido bloqueado para el usuario.');
        // Actualiza la lista de multas o usuarios
      },
      (error) => {
        console.error('Error al bloquear permisos:', error);
        alert('No se pudo bloquear el permiso. Intenta de nuevo.');
      }
    );
  }
  

}
