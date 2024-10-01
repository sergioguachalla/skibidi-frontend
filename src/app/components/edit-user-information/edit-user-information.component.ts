import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CustomerServiceService} from "../../services/customer-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-user-information',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-information.component.html',
  styleUrl: './edit-user-information.component.css'
})
export class EditUserInformationComponent {

  updateForm: FormGroup;
  customerService: CustomerServiceService= inject(CustomerServiceService);
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.updateForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, ]],
      direccion: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      ci: ['', Validators.required],
      departamento: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }





}
