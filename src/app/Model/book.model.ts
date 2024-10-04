export interface BookDto {
  //TODO: change id
  id: number | null;
  title: string;
  isbn: string;
  registrationDate: Date;
  status: boolean;
  image_url: string;
  genreId: number;
  authors: string[];
}
