import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-environment-client',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './environment-client.component.html',
  styleUrl: './environment-client.component.css'
})
export class EnvironmentClientComponent {
  @ViewChild('mapa', { static: false }) mapaRef!: ElementRef;
  mensaje: string = '';

  ngAfterViewInit() {
    const objectElement = this.mapaRef.nativeElement as HTMLObjectElement;

    objectElement.onload = () => {
      const svgDoc = objectElement.contentWindow?.document;
      if (svgDoc) {
        let previousSala: Element | null = null;

        for (let i = 1; i <= 6; i++) {
          const sala = svgDoc.getElementById(`SALA-B${i}`);
          if (sala) {
            sala.addEventListener('click', () => {
              // Quitar el color de la sala previamente seleccionada
              if (previousSala) {
                (previousSala as HTMLElement).style.fill = '#d4f7de';
              }
              // Cambiar el color de la sala seleccionada
              (sala as HTMLElement).style.fill = 'red';
              this.mensaje = `Sala seleccionada: SALA-B${i}`;
              previousSala = sala;
            });
          }
        }
      }
    };
  }


}
