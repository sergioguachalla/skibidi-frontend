import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar esto

@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para utilizar *ngFor y otras directivas comunes
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent {

  // Datos estáticos de ejemplo
  librosFiltrados = [
    {
      imagen: 'https://via.placeholder.com/100x120',
      titulo: 'El Principito',
      autor: 'Antoine de Saint-Exupéry',
      descripcion: 'Un niño que viaja a través de planetas explorando lecciones de vida.',
      disponible: true
    },
    {
      imagen: 'https://via.placeholder.com/100x120',
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      descripcion: 'Una historia épica de la familia Buendía en Macondo.',
      disponible: false
    }
  ];

  updateSearchQuery(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Buscar:', input.value);
  }

  onSearch() {
    console.log('Búsqueda en curso...');
  }
}
