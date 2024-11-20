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
    const modalElement = document.getElementById('editFineModal');
    if (modalElement) {
      // @ts-ignore
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
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
}
