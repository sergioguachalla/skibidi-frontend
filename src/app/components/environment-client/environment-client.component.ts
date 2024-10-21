import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from "@angular/common";
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnvironmentService } from "../../services/environment.service";
import { KeycloakService } from "keycloak-angular";
import { EnvironmentReservationDto } from "../../Model/environment.model";
import {Router} from "@angular/router";
declare var bootstrap: any;

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
  previousSala: Element | null = null;
  selectedUserName: string = '';
  selectedEnvironmentName: string = '';


  constructor(
    private environmentService: EnvironmentService,
    private keycloakService: KeycloakService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    const currentDate = new Date();
    this.today = currentDate.toLocaleDateString('en-CA');;
    console.log('Fecha actual:', this.today);
    this.currentTime = currentDate.toTimeString().slice(0, 5);
    this.reservaForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      proposito: ['', Validators.required]
    }, {
      validators: this.validateTimeRange()
    });
  }

  onDateOrTimeChange() {
    this.previousSala = null;
    this.mensaje = '';
    const { fecha, horaEntrada, horaSalida } = this.reservaForm.value;

    if (fecha === this.today && horaEntrada < this.currentTime) {
      this.reservaForm.get('horaEntrada')?.setErrors({ invalidTime: true });
    } else {
      this.reservaForm.get('horaEntrada')?.setErrors(null);
    }

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
    for (let i = 1; i <= 6; i++) {
      const sala = svgDoc.getElementById(`SALA-B${i}`);
      if (sala) {
        sala.addEventListener('click', () => {
          if (this.reservaForm.valid && (sala.style.fill === 'rgb(212, 247, 222)' || sala.style.fill === '#d4f7de' || sala.style.fill === 'lightblue')) {
            if (this.previousSala) {
              (this.previousSala as HTMLElement).style.fill = '#d4f7de';
            }
            if (this.previousSala === sala) {
              (sala as HTMLElement).style.fill = '#d4f7de';
              this.mensaje = '';
              this.previousSala = null;
            } else {
              (sala as HTMLElement).style.fill = 'lightblue';
              this.mensaje = `Sala seleccionada: SALA-B${i}`;
              this.previousSala = sala;
            }
          } else {
            alert('Por favor, complete los campos requeridos antes de seleccionar una sala o esta sala no está disponible.');
          }
        });
      }
    }
  }

  confirmSubmission(): void {
    const environmentId = parseInt(this.mensaje.split('SALA-B')[1], 10);

    const fecha = this.reservaForm.get('fecha')?.value;
    const horaEntrada = this.reservaForm.get('horaEntrada')?.value;
    const horaSalida = this.reservaForm.get('horaSalida')?.value;

    const clockIn = new Date(`${fecha}T${horaEntrada}:00`);
    const clockOut = new Date(`${fecha}T${horaSalida}:00`);

    const offsetInMs = clockIn.getTimezoneOffset() * 60 * 1000;
    clockIn.setTime(clockIn.getTime() - offsetInMs);
    clockOut.setTime(clockOut.getTime() - offsetInMs);

    const reservation: EnvironmentReservationDto = {
      clientId: this.keycloakService.getKeycloakInstance().subject!,
      environmentId: environmentId,
      reservationDate: fecha,
      clockIn: clockIn,
      clockOut: clockOut,
      purpose: this.reservaForm.get('proposito')?.value,
      reservationStatus: true,
      status: 1
    };

    this.environmentService.createEnvironmentReservation(reservation).subscribe(
      (response) => {
        const modalElement = document.getElementById('confirmationModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Reserva realizada con éxito para ' + this.mensaje);
        this.router.navigate(['/view-book']);
      },
      (error) => {
        console.error('Error al registrar la reserva:', error);
        alert('Hubo un error al realizar la reserva.');
      }
    );
  }


  validateTimeRange() {
    return (formGroup: FormGroup) => {
      const horaEntradaControl = formGroup.get('horaEntrada');
      const horaSalidaControl = formGroup.get('horaSalida');

      if (horaEntradaControl && horaSalidaControl) {
        const horaEntrada = horaEntradaControl.value;
        const horaSalida = horaSalidaControl.value;

        if (horaEntrada && horaSalida && horaEntrada >= horaSalida) {
          horaSalidaControl.setErrors({ invalidRange: true });
        } else {
          horaSalidaControl.setErrors(null);
        }
      }
    };
  }

  openConfirmationModal(): void {
    if (this.reservaForm.valid && this.mensaje.includes('Sala seleccionada:')) {
      const modalElement = document.getElementById('confirmationModal');
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      alert('Por favor, complete el formulario y seleccione una sala antes de confirmar la reserva.');
    }
  }

  onSubmit() {
    if (this.reservaForm.valid && this.mensaje && this.mensaje.includes('Sala seleccionada:')) {
      this.openConfirmationModal();
    } else {
      alert('Por favor, seleccione una sala disponible antes de enviar la reserva.');
    }
  }


}

