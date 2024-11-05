// lend-book.model.ts
export interface LendBookDto {
    clientName: string;
    lendBookId: number;
    lendDate: string;
    returnDate: string;
    notes: string;
    title: string;
    authors: string;
    status: number;
  }
  
  export interface Pageable {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  }
  
  export interface LendBookPageResponse {
    content: LendBookDto[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: { sorted: boolean; unsorted: boolean; empty: boolean };
    first: boolean;
    empty: boolean;
  }
  