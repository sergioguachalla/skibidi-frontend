export interface BookDetailsDto {
    //TODO: change id
  
    bookId: number | null;
    title: string;
    isbn: string;
    registrationDate: Date;
    status: boolean;
    image_url: string;
    genreId: number;
    authors: string[];
    editorialName: string; 
    languageName: string;  
  }
  