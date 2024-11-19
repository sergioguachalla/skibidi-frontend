import {Component, inject} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FinesService} from "../../services/fines.service";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-paid-fines',
  standalone: true,
  imports: [
    NavbarComponent,
    CurrencyPipe,
    DatePipe,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './paid-fines.component.html',
  styleUrl: './paid-fines.component.css'
})
export class PaidFinesComponent {

  private fineService: FinesService = inject(FinesService);
  protected paidFines: any = [];
  private page: number = 0;
  private size: number = 5;
  currentPage = 1;
  usernameQuery = '';

  totalPages = 0;
  constructor() {
    this.findPaidFines(this.page, this.size);
    this.updateTotalPages();
  }

  findPaidFines(page:number, size: number) {
    page = this.page;
    size = this.size;

    this.fineService.findPaidFines(this.page, this.size,null).subscribe((response) => {
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
      this.findPaidFines(page, this.size);
    }
  }
  searchUsername() {
    if (this.usernameQuery === '') {
      this.findPaidFines(this.page, this.size);
    }
    this.fineService.findPaidFines(this.page, this.size, this.usernameQuery).subscribe((response) => {
      this.paidFines = response.data.content;
      this.totalPages = response.data.totalPages;
    });
  }

}
