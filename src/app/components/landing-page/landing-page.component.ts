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

  openRegisterBookModal(): void {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('chooseRegistrationModal'),
    );
    modal.show();
  }

  openIsbnModal(): void {
    (window as any).bootstrap.Modal.getInstance(
      document.getElementById('chooseRegistrationModal'),
    ).hide();

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('registerIsbnModal'),
    );
    modal.show();
  }

  submitIsbn(): void {
    const isbn = (document.getElementById('isbnInput') as HTMLInputElement)
      .value;

    console.log(`ISBN ingresado: ${isbn}`);

    (window as any).bootstrap.Modal.getInstance(
      document.getElementById('registerIsbnModal'),
    ).hide();
  }
}
