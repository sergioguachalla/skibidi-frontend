import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {NgForOf, NgIf} from "@angular/common";
import {UserClient} from "../../Model/userclient.model";
declare var bootstrap: any;
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvironmentService } from '../../services/environment.service';
import { UserClientService } from '../../services/userclient.service';
import { EnvironmentReservationDto } from '../../Model/environment.model';
declare var bootstrap: any;


@Component({
  selector: 'app-edit-reservation',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './edit-reservation.component.html',
  styleUrl: './edit-reservation.component.css'
})
export class EditReservationComponent implements OnInit {
  @ViewChild('mapa', { static: false }) mapaRef!: ElementRef;
  environments: any[] = [];
  // Inicializando reservation para evitar problemas con valores undefined
  reservation: EnvironmentReservationDto = {
    clientId: '',
    environmentId: 0,
    reservationDate: '',
    clockIn: new Date(),
    clockOut: new Date(),
    purpose: '',
    reservationStatus: false,
    status: 1
  };
  reservaForm: FormGroup;
  mensaje: string = '';
  today: string = '';
  currentTime: string = '';
  reservationId: number | null = null;
  previousSala: Element | null = null;

  constructor(
    private environmentService: EnvironmentService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.today = new Date().toISOString().slice(0, 10);
    this.currentTime = new Date().toTimeString().slice(0, 5);
    this.reservaForm = this.formBuilder.group({
      fecha: ['', Validators.required],
      horaEntrada: ['', Validators.required],
      horaSalida: ['', Validators.required],
      proposito: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.reservationId = +id;
        this.loadReservation(this.reservationId);
      }
    });
  }

  loadReservation(id: number): void {
    this.environmentService.getEnvironmentReservationById(id).subscribe((response: any) => {
      if (response && response.data) {
        this.reservation = response.data;
        this.reservaForm.patchValue({
          fecha: this.reservation.reservationDate,
          horaEntrada: this.formattedClockIn,
          horaSalida: this.formattedClockOut,
          proposito: this.reservation.purpose,
        });
        this.updateSVG(response.data);
      }
    }, error => {
      console.error('Error al cargar la reserva:', error);
    });
  }

  updateSVG(environments: any = []) {
    const objectElement = this.mapaRef.nativeElement as HTMLObjectElement;
    const svgDoc = objectElement.contentWindow?.document;

    if (svgDoc) {
      environments.forEach((env: { name: string; isAvailable: any; }) => {
        const sala = svgDoc.getElementById(env.name);
        if (sala) {
          sala.style.fill = env.isAvailable ? '#d4f7de' : 'red';
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
          if (this.previousSala) {
            (this.previousSala as HTMLElement).style.fill = '#d4f7de';
          }
          (sala as HTMLElement).style.fill = 'lightblue';
          this.mensaje = `Sala seleccionada: SALA-B${i}`;
          this.previousSala = sala;
        });
      }
    }
  }

  confirmSubmission(): void {
    if (!this.reservationId) return;
    const fecha = this.reservaForm.get('fecha')?.value;
    const horaEntrada = this.reservaForm.get('horaEntrada')?.value;
    const horaSalida = this.reservaForm.get('horaSalida')?.value;

    const clockIn = new Date(`${fecha}T${horaEntrada}:00`);
    const clockOut = new Date(`${fecha}T${horaSalida}:00`);

    this.reservation = {
      ...this.reservation, // Asegurarse de que exista antes de intentar usarla
      reservationDate: fecha,
      clockIn,
      clockOut,
      purpose: this.reservaForm.get('proposito')?.value,
      environmentId: parseInt(this.mensaje.split('SALA-B')[1], 10),
    };

    this.environmentService.updateEnvironmentReservation(this.reservationId, this.reservation).subscribe(
      response => {
        const modalElement = document.getElementById('confirmationModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        alert('Reserva actualizada correctamente.');
        this.router.navigate(['/reservations']);
      },
      error => {
        console.error('Error al actualizar la reserva:', error);
      }
    );
  }

  get formattedClockIn(): string {
    return this.reservation.clockIn ? this.reservation.clockIn.toISOString().substring(11, 16) : '';
  }

  get formattedClockOut(): string {
    return this.reservation.clockOut ? this.reservation.clockOut.toISOString().substring(11, 16) : '';
  }
}
