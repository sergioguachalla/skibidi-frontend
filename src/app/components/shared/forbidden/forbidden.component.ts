import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); // Redirect to home page or desired route
  }
}
