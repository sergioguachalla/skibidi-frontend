import { Component } from '@angular/core';
import {NavbarComponent} from "../shared/navbar/navbar.component";

@Component({
  selector: 'app-fine-list',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './fine-list.component.html',
  styleUrl: './fine-list.component.css'
})
export class FineListComponent {

}
