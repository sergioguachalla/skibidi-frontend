import {Component, inject} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FinesService} from "../../services/fines.service";
import {CurrencyPipe, DatePipe} from "@angular/common";

@Component({
  selector: 'app-paid-fines',
  standalone: true,
  imports: [
    NavbarComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './paid-fines.component.html',
  styleUrl: './paid-fines.component.css'
})
export class PaidFinesComponent {

  private fineService: FinesService = inject(FinesService);

  private paidFines: any = [];

  private page: number = 0;
  private size: number = 10;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  constructor() {
    this.findPaidFines()
  }

  findPaidFines() {
    this.fineService.findPaidFines(this.page, this.size).subscribe((response) => {
      this.paidFines = response
      console.log(response)
    });
  }


  get paginatedFines() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.paidFines.slice(start, end);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
