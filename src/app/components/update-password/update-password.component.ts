import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {UserClientService} from "../../services/userclient.service";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent implements OnInit{

  updatePasswordForm: FormGroup;
  requestId: string | null = null;
  submitted = false;
  passwordUpdated = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    protected router: Router,
    private userService: UserClientService
  ) {
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator })
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe( params => {
      this.requestId = params.get('id');
      if (!this.requestId) {
        alert('No se proporcionó un ID de solicitud valida.');
        this.router.navigate(['/']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true }
  }

  onSubmit(): void {
    this.submitted = true;

    if(this.updatePasswordForm.invalid) return;

    const newPassword = this.updatePasswordForm.get('password')?.value;
    this.userService.updatePassword(this.requestId!, newPassword!).subscribe(
      response => {
        alert('Contraseña actualizada exitosamente.');
        this.passwordUpdated = true;
        this.router.navigate(['/']);
      },
      error => {
        alert('Error al actualizar la contraseña.')
        console.log(error);
      }
    )
  }

  get f(){
    return this.updatePasswordForm.controls;
  }

}
