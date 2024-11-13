import {Component, inject} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {UserClientService} from "../../services/userclient.service";
import {NgForOf, NgIf} from "@angular/common";
import {FinesService} from "../../services/fines.service";
>>>>>>> c698002 (add client list component)

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent {

  private userClientService: UserClientService = inject(UserClientService);
  private fineService: FinesService = inject(FinesService);
  protected clients: any[] = [];
  selectedClient: any;
  debts: any[] = [];
  isModalOpen: boolean = false;
  constructor() {
    this.findAllClients();
  }

  findAllClients() {
    this.userClientService.getAllUserClients().subscribe((response) => {
      this.clients = response.data;
    });
  }

  onConsultDebts(userKcId: string): void {
    this.selectedClient = userKcId;
    this.fineService.findAll(0,10,null, userKcId).subscribe((response) => {
      this.debts = response.data.content;
      this.isModalOpen = true;
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
