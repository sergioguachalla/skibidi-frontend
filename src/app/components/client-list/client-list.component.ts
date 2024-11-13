import {Component, inject} from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";
import {UserClientService} from "../../services/userclient.service";
<<<<<<< HEAD
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FinesService} from "../../services/fines.service";
import {FormsModule} from "@angular/forms";
=======
import {NgForOf} from "@angular/common";
import {FinesService} from "../../services/fines.service";
>>>>>>> c698002 (add client list component)

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    NavbarComponent,
<<<<<<< HEAD
    NgForOf,
    NgIf,
    NgClass,
    FormsModule
=======
    NgForOf
>>>>>>> c698002 (add client list component)
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

  onConsultDebt(userKcId: string) {
    this.fineService.findAll(0, 10, null, userKcId).subscribe((response) => {
      console.log(response);
    });
  }
}
