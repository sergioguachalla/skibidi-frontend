import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { UserClientService } from '../../services/userclient.service';
import { UserClient } from '../../Model/userclient.model';

@Component({
  selector: 'app-update-study-room-reservation-capabilities',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './update-study-room-reservation-capabilities.component.html',
  styleUrls: ['./update-study-room-reservation-capabilities.component.css']
})
export class UpdateStudyRoomReservationCapabilitiesComponent implements OnInit {
  userClients: UserClient[] = [];  // This is where all user clients will be stored
  selectedClientId: string | null = null;  // This is the currently selected user's ID
  statusMessage: string = '';  // This message will display the status after changing permissions

  constructor(private userClientService: UserClientService) {}

  ngOnInit(): void {
    // Fetch all users from the service
    this.userClientService.getAllUserClients(null).subscribe(response => {
      this.userClients = response.data;  // Store the fetched users in the `userClients` array
    });
  }

  // Function to toggle the reservation permission for a selected user
  toggleReservationPermission(): void {
    if (!this.selectedClientId) {
      return;  // If no user is selected, do nothing
    }

    // Call the service to toggle reservation permission for the selected user
    this.userClientService.toggleReservationPermission(this.selectedClientId).subscribe({
      next: (response) => {
        // Display success message after changing the reservation status
        this.statusMessage = `El estado de reservas para el usuario ha sido actualizado a: ${response.data ? 'Habilitado' : 'Deshabilitado'}`;
      },
      error: (err) => {
        console.error('Error al cambiar el estado:', err);
        // Display error message in case of failure
        this.statusMessage = 'Hubo un error al intentar cambiar el estado. Por favor, inténtalo de nuevo.';
      }
    });
  }
}
