import {Component, inject} from '@angular/core';
import {TypeFineService} from "../../servic/type-fine.service";
import {NgForOf, NgIf} from "@angular/common";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-type-fine',
  standalone: true,
  imports: [
    NgForOf,
    NavbarComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './type-fine.component.html',
  styleUrl: './type-fine.component.css'
})
export class TypeFineComponent {

  typeFineService: TypeFineService = inject(TypeFineService);
  selectedFine : any;
  typeFines: any[] = [];
  isEditModalOpen: boolean = false;
  isSaveModalOpen: boolean = false;
  error = null;
  constructor() {
    this.findAllTypeFines();
  }

  findAllTypeFines() {
    this.typeFineService.findAll().subscribe((response) => {
      this.typeFines = response.data;
      console.log(this.typeFines);
    });
  }

  openEditModal(fine: any) {
    this.isEditModalOpen = true;
    this.selectedFine = { ...fine };

  }
  openCreateModal() {
    this.isSaveModalOpen = true;
    this.selectedFine = { name: '', amount: 0, description: '' };
  }



  cancelEdit() {
    this.selectedFine = null;
    this.isEditModalOpen = false;
  }

  saveEdit() {
    this.typeFineService.updateFine(this.selectedFine).subscribe(() => {
      this.findAllTypeFines();
      this.cancelEdit();
    });
  }
  saveTypeFine() {
    this.typeFineService.saveFine(this.selectedFine).subscribe(() => {
      this.findAllTypeFines();
      this.isSaveModalOpen = false;
    });
  }

  deleteFine(id: number) {
    alert('Esta seguro de eliminar el tipo de multa?');
    this.typeFineService.deleteFine(id).subscribe(
      response => {
        this.findAllTypeFines();
      },
      error => {
        alert('No se puede eliminar el tipo de multa');
        this.error = error;
      }
      );
  }
}
