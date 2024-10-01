import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { EnvironmentService } from "../../services/environment.service";
import { KeycloakService } from "keycloak-angular";
import {EnvironmentReservationDto} from "../../Model/environment.model";

@Component({
  selector: 'app-environment-client',
  standalone: true,
  imports: [
    NgIf,
    NavbarComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './environment-client.component.html',
  styleUrl: './environment-client.component.css'
})
export class EnvironmentClientComponent {
  @ViewChild('mapa', { static: false }) mapaRef!: ElementRef;
  mensaje: string = '';
  today: string = "";
  currentTime: string = '';
  reservaForm: FormGroup;

  constructor(
    private environmentService: EnvironmentService,
    private keycloakService: KeycloakService,
    private formBuilder: FormBuilder
  ) {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    this.currentTime = currentDate.toTimeString().slice(0, 5);
    this.reservaForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      proposito: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    const objectElement = this.mapaRef.nativeElement as HTMLObjectElement;
    objectElement.onload = () => {
      this.updateSVG();
    };
  }

  onDateOrTimeChange() {
    const { fecha, horaEntrada, horaSalida } = this.reservaForm.value;

    if (fecha && horaEntrada && horaSalida) {
      const from = `${fecha}T${horaEntrada}:00`;
      const to = `${fecha}T${horaSalida}:00`;

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
          sala.style.fill = env.isAvailable ? '#d4f7de' : 'red';
          sala.replaceWith(sala.cloneNode(true));
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
          if (sala.style.fill === 'rgb(212, 247, 222)' || sala.style.fill === '#d4f7de' || sala.style.fill === 'lightblue') {
            if (previousSala) {
              (previousSala as HTMLElement).style.fill = '#d4f7de';
            }
            if (previousSala === sala) {
              (sala as HTMLElement).style.fill = '#d4f7de';
              this.mensaje = '';
              previousSala = null;
            } else {
              (sala as HTMLElement).style.fill = 'lightblue';
              this.mensaje = `Sala seleccionada: SALA-B${i}`;
              previousSala = sala;
            }
          } else {
            alert('Esta sala no está disponible para reservar.');
          }
        });
      }
    }
  }

  onSubmit() {
    if (this.reservaForm.valid && this.mensaje && this.mensaje.includes('Sala seleccionada:')) {
      const environmentId = parseInt(this.mensaje.split('SALA-B')[1], 10);
      console.log('ID del ambiente seleccionado:', environmentId);
      const reservation: EnvironmentReservationDto = {
        clientId: this.keycloakService.getKeycloakInstance().subject!,
        environmentId: environmentId,
        reservationDate: this.reservaForm.get('fecha')?.value,
        clockIn: new Date(`${this.reservaForm.get('fecha')?.value}T${this.reservaForm.get('horaEntrada')?.value}:00`),
        clockOut: new Date(`${this.reservaForm.get('fecha')?.value}T${this.reservaForm.get('horaSalida')?.value}:00`),
        purpose: this.reservaForm.get('proposito')?.value,
        reservationStatus: true,
        status: 1
      };

      this.environmentService.createEnvironmentReservation(reservation).subscribe(
        (response) => {
          console.log('Reserva realizada:', response);
          alert('Reserva realizada con éxito para ' + this.mensaje);
        },
        (error) => {
          console.error('Error al registrar la reserva:', error);
          alert('Hubo un error al realizar la reserva.');
        }
      );
    } else {
      alert('Por favor, seleccione una sala disponible antes de enviar la reserva.');
    }
  }
}
