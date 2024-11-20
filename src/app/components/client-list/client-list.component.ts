import {Component, inject} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {UserClientService} from "../../services/userclient.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FinesService} from "../../services/fines.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent {

  private userClientService: UserClientService = inject(UserClientService);
  private fineService: FinesService = inject(FinesService);
  protected clients: any[] = [];
  protected searchTerm: string = '';
  selectedClient: any;
  debts: any[] = [];
  isModalOpen: boolean = false;
  isValidSearchTerm: boolean = true;

  constructor() {
    this.findAllClients();
  }

  findAllClients() {
    this.userClientService.getAllUserClients(null).subscribe((response) => {
      this.clients = response.data;
    });
  }

  onConsultDebts(userKcId: string): void {
    this.selectedClient = this.clients.find(client => client.kcUuid === userKcId);
    this.fineService.findAll(0,10,null, userKcId).subscribe((response) => {
      this.debts = response.data.content;
      this.isModalOpen = true;
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  onSearchTermChange() {
    this.searchTerm = this.searchTerm.trim();

    const validPattern = /^[a-zA-Z0-9\s]*$/;
    this.isValidSearchTerm = validPattern.test(this.searchTerm);
  }

  searchClient() {
    if (!this.isValidSearchTerm) {
      return;
    }
    this.userClientService.getAllUserClients(this.searchTerm).subscribe((response) => {
      this.clients = response.data;
    });
  }
}
