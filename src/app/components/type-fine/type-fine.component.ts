import {Component, inject} from '@angular/core';
import {TypeFineService} from "../../servic/type-fine.service";
import {NgForOf} from "@angular/common";
import {NavbarComponent} from "../shared/navbar/navbar.component";

@Component({
  selector: 'app-type-fine',
  standalone: true,
  imports: [
    NgForOf,
    NavbarComponent
  ],
  templateUrl: './type-fine.component.html',
  styleUrl: './type-fine.component.css'
})
export class TypeFineComponent {

  typeFineService: TypeFineService = inject(TypeFineService);

  typeFines: any[] = [];

  constructor() {
    this.findAllTypeFines();
  }

  findAllTypeFines() {
    this.typeFineService.findAll().subscribe((response) => {
      this.typeFines = response.data;
      console.log(this.typeFines);
    });
  }

  editFine() {

  }
  addFine() {

  }

  deleteFine() {

  }
}
