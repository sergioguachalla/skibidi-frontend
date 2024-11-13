import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FinesService} from "../../services/fines.service";
import {NgForOf, NgIf} from "@angular/common";
import {toArray} from "rxjs";

@Component({
  selector: 'app-fine-list',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './fine-list.component.html',
  styleUrl: './fine-list.component.css'
})
export class FineListComponent implements OnInit {
  fines: any = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];
  private fineService: FinesService = inject(FinesService);

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

}
