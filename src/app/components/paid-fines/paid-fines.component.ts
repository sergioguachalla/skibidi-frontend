import {Component, inject} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FinesService} from "../../services/fines.service";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-paid-fines',
  standalone: true,
  imports: [
    NavbarComponent,
    CurrencyPipe,
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './paid-fines.component.html',
  styleUrl: './paid-fines.component.css'
})
export class PaidFinesComponent {

  private fineService: FinesService = inject(FinesService);

  protected paidFines: any = [];

  private page: number = 0;
  private size: number = 10;

  currentPage = 1;

  totalPages = 0;
  constructor() {
    this.findPaidFines()
    this.updateTotalPages();
  }

  findPaidFines() {
    this.fineService.findPaidFines(this.page, this.size).subscribe((response) => {
      this.paidFines = response.data.content;
      this.totalPages = response.data.totalPages;
      console.log(response.data.content)
    });
  }


  updateTotalPages() {
    this.totalPages = Math.ceil(this.paidFines.length / this.size);
  }

  get paginatedFines() {
    const startIndex = (this.currentPage - 1) * this.size;
    const endIndex = startIndex + this.size;
    return this.paidFines.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
