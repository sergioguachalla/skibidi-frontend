import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { BookDto } from '../../Model/book.model';

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {
  librosFiltrados: BookDto[] = [];
  mensaje: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAllBooks().subscribe(
      response => {
        console.log('Respuesta del API:', response);
        if (response.successful) {
          this.librosFiltrados = response.data.map((libro, index) => ({
            ...libro,
            id: index + 1 
          }));
          console.log('Libros cargados:', this.librosFiltrados);
          this.mensaje = 'Libros recuperados exitosamente!';
        } else {
          console.error('Error al cargar los libros:', response.message);
          this.mensaje = 'No se pudieron recuperar los libros.';
        }
      },
      error => {
        console.error('Error al conectar con el API:', error);
        this.mensaje = 'Ocurrió un error al conectar con el API.';
      }
    );
  }

  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Buscar:', input.value);
  }

  onSearch() {
    console.log('Búsqueda en curso...');
  }

  toggleAvailability(libro: BookDto) {
    const originalStatus = libro.status; 
    const confirmMessage = libro.status ? '¿Desea marcar este libro como OCUPADO?' : '¿Desea marcar este libro como DISPONIBLE?';
  
    if (confirm(confirmMessage)) {
      libro.status = !originalStatus; 
  
      
      const updatedBook = { ...libro }; 
  
      console.log('ID del libro:', libro.id); 
  
      this.bookService.updateBook(libro.id, updatedBook).subscribe(
        response => {
          console.log('Estado actualizado:', response);
          this.mensaje = 'Estado del libro actualizado exitosamente!';
        },
        error => {
          console.error('Error al actualizar el libro:', error);
          libro.status = originalStatus; 
          this.mensaje = 'Error al actualizar el estado del libro.';
        }
      );
    } else {
      libro.status = originalStatus; 
    }
  }
}
