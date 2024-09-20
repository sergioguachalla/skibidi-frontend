import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    throw new Error(
      'Method not implemented. check LandingPageComponent.ts > ngOnInit()',
    );
  }

  onLogin(): void {
    throw new Error(
      'Method not implemented. check LandingPageComponent.ts > onLogin()',
    );
  }

  onRegisterCustomer(): void {
    this.router.navigate(['/register-customer']);
  }

  onRegisterLibrarian(): void {
    throw new Error(
      'Method not implemented. check LandingPageComponent.ts > onRegisterLibrarian()',
    );
  }

  onViewBooks(): void {
    throw new Error(
      'Method not implemented. check LandingPageComponent.ts > onViewBooks()',
    );
  }
}
