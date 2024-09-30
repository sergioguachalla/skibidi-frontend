import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FormsModule} from "@angular/forms";
import {EnvironmentService} from "../../services/environment.service";

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

  constructor(
    private environmentService: EnvironmentService
  ) {}

  ngAfterViewInit() {
    const objectElement = this.mapaRef.nativeElement as HTMLObjectElement;

    objectElement.onload = () => {
      this.updateSVG();
    };
  }

  onDateOrTimeChange() {
    if (this.reserva.fecha && this.reserva.horaEntrada && this.reserva.horaSalida) {
      const from = `${this.reserva.fecha}T${this.reserva.horaEntrada}:00`;
      const to = `${this.reserva.fecha}T${this.reserva.horaSalida}:00`;

      this.environmentService.getEnvironmentsAvailability(from, to).subscribe(
        (response) => {
          this.updateSVG(response.data);
        },
        (error) => {
          console.error('Error al obtener la disponibilidad:', error);
        }
      );
    }
  }

  updateSVG(environments: any[] = []) {
    const objectElement = this.mapaRef.nativeElement as HTMLObjectElement;
    const svgDoc = objectElement.contentWindow?.document;

    if (svgDoc) {
      environments.forEach(env => {
        const sala = svgDoc.getElementById(env.name);
        if (sala) {
          (sala as HTMLElement).style.fill = env.isAvailable ? '#d4f7de' : 'red';
        }
      });
      this.setupClickEvents(svgDoc);
    }
  }

  setupClickEvents(svgDoc: Document) {
    let previousSala: Element | null = null;

    for (let i = 1; i <= 6; i++) {
      const sala = svgDoc.getElementById(`SALA-B${i}`);
      if (sala) {
        sala.addEventListener('click', () => {
          if (previousSala) {
            (previousSala as HTMLElement).style.fill = '#d4f7de';
          }
          (sala as HTMLElement).style.fill = 'red';
          this.mensaje = `Sala seleccionada: SALA-B${i}`;
          previousSala = sala;
        });
      }
    }
  }

  onSubmit() {
    if (this.mensaje) {
      console.log('Reserva enviada:', {
        sala: this.mensaje,
        ...this.reserva
      });

      const from = `${this.reserva.fecha}T${this.reserva.horaEntrada}:00`;
      const to = `${this.reserva.fecha}T${this.reserva.horaSalida}:00`;

      this.environmentService.getEnvironmentsAvailability(from, to).subscribe(
        (response) => {
          console.log('Disponibilidad recibida:', response);
          alert('Reserva realizada con éxito para ' + this.mensaje);
        },
        (error) => {
          console.error('Error al obtener la disponibilidad:', error);
          alert('Hubo un error al realizar la reserva.');
        }
      );
    }
  }
}
