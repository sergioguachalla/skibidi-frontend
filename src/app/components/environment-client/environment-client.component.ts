import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-environment-client',
  standalone: true,
  imports: [
    NgIf,
    NavbarComponent,
    FormsModule
  ],
  templateUrl: './environment-client.component.html',
  styleUrl: './environment-client.component.css'
})
export class EnvironmentClientComponent {
  @ViewChild('mapa', { static: false }) mapaRef!: ElementRef;
  mensaje: string = '';
  reserva = {
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    proposito: ''
  };

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
  onSubmit() {
    if (this.mensaje) {
      console.log('Reserva enviada:', {
        sala: this.mensaje,
        ...this.reserva
      });
      alert('Reserva realizada con éxito para ' + this.mensaje);
    }
  }

}
