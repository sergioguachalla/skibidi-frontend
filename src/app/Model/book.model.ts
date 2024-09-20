export interface BookDto {
  id: number;
  title: string;
  isbn: string;
  registrationDate: Date;
  status: boolean;
  image_url: string;
  genreId: number;
  authors: string[];  
}