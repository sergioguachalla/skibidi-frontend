import {Component, OnInit} from '@angular/core';
import {BookDto} from "../../Model/book.model";
import {BookService} from "../../services/book.service";
import {KeycloakService} from "keycloak-angular";
import {NgForOf, NgIf} from "@angular/common";
import {NavbarComponent} from "../shared/navbar/navbar.component";

@Component({
  selector: 'app-favorites-books',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NavbarComponent
  ],
  templateUrl: './favorites-books.component.html',
  styleUrl: './favorites-books.component.css'
})
export class FavoritesBooksComponent implements OnInit {
  favorites: BookDto[] = []; // Array to store the favorite books

  constructor(
    private bookService: BookService,
    private keycloakService: KeycloakService
    ) {}

  ngOnInit(): void {
    const kcId = this.keycloakService.getKeycloakInstance().subject;
    this.loadFavorites(kcId!);
  }

  // Method to load the list of favorite books
  loadFavorites(kcId: string): void {
    this.bookService.getFavoriteBooks(kcId).subscribe(
      (response) => {
        console.log("RESPONSE: ", response)
        this.favorites = response.data
      },
      (error) => {
        console.error('Error al cargar los libros favoritos:', error);
      }
    );
    console.log("loadFavorites")
  }

  // Method to remove a book from the favorites list
  removeFromFavorites(book: BookDto): void {
    if (confirm(`¿Estás seguro de eliminar "${book.title}" de favoritos?`)) {
      const kcId = this.keycloakService.getKeycloakInstance().subject;
      this.bookService.addOrRemoveFromFavorites(kcId!, book.bookId).subscribe(
        (response) => {
          this.favorites = this.favorites.filter((b) => b.bookId !== book.bookId);
          alert('Libro eliminado de favoritos');
        },
        (error) => {
          console.error('Error al eliminar el libro de favoritos:', error);
          alert('Hubo un error al eliminar el libro de favoritos');
        }
      );
    }
  }
}
