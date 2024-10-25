import {Component, inject, signal, Signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CustomerServiceService} from "../../services/customer-service.service";
import {Router} from "@angular/router";
// @ts-ignore
import {UserRegistrationDto} from "../../Model/dto/UserRegistrationDto";
import {KeycloakService} from "keycloak-angular";
import {UserClientService} from "../../services/userclient.service";
import {NavbarComponent} from "../shared/navbar/navbar.component";

export interface initialState {
  data: any | any[] | null;
  message: string | null;
  successful: boolean;

}

@Component({
  selector: 'app-edit-user-information',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './edit-user-information.component.html',
  styleUrl: './edit-user-information.component.css'
})
export class EditUserInformationComponent {

  updateForm: FormGroup;
  userInformation: UserRegistrationDto | null = null;

  state: WritableSignal<initialState> = signal({
    data: null,
    message: null,
    successful: false
  });
  userService: UserClientService= inject(UserClientService);
  keycloakService : KeycloakService = inject(KeycloakService);
  constructor(private formBuilder: FormBuilder, private router: Router) {
    if (!this.keycloakService.isLoggedIn()) {
      this.router.navigate(['/']).then(r => console.log('Redirect to login'));
    }

    this.findUserByKcId();
    this.updateForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, ]],
      direccion: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      ci: [{ value: '', disabled: true }, Validators.required],
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

  findUserByKcId() {
    return this.userService.findUserByKcId(
      this.keycloakService.getKeycloakInstance().subject!
    ).subscribe((response: initialState) => {
      this.state = signal({
        data: response.data,
        message: response.message,
        successful: response.successful
      });
      this.userInformation = response.data;
      this.updateForm.patchValue({
        nombres: this.userInformation!.personDto.name,
        apellidos: this.userInformation!.personDto.lastName,
        email: this.userInformation!.userDto.email,
        username: this.userInformation!.userDto.name,
        ci: this.userInformation!.personDto.idNumber,
        departamento: this.userInformation!.personDto.expedition,
        direccion: this.userInformation!.personDto.address
      });
    });
  }

  openConfirmationAlert() {
    const confirmed = window.confirm("¿Estás seguro que deseas actualizar tu contraseña?")

    if (confirmed) this.updatePassword()
    else window.alert("Actualización de la contraseña cancelada.")
  }

  updatePassword(){
    window.alert("Revisa la bandeja de tu correo para actualizar tu contraseña.")
    const email =  this.updateForm.get('email')?.value;

    console.log("EMAIL: ", email );

    this.userService.forgotPassword(email).subscribe();
  }

  onSubmit() {
    const userDto = this.toUserRegistrationDto(this.updateForm.value);
    const userKcId = this.keycloakService.getKeycloakInstance().subject!;

    this.userService.updateUserClient(userDto, userKcId).subscribe(
      (response: initialState) => {
        this.state = signal({
          data: response.data,
          message: response.message,
          successful: response.successful
        });
        if (userDto.userDto.password && userDto.userDto.password.trim() !== '') {
          this.keycloakService.logout(window.location.origin).then(() => {
            this.router.navigate(['/']).then(r => console.log('Logout and redirect successful'));
          }).catch(err => {
            console.error('Logout error:', err);
          });
        }
      },
      error => {
        console.error('Update error:', error);
      }
    );
  }



  toUserRegistrationDto(data: any) {
    const personDto = {
      name: this.updateForm.get('nombres')?.value,
      lastName: this.updateForm.get('apellidos')?.value,
      idNumber: this.updateForm.get('ci')?.value,
      expedition: this.updateForm.get('departamento')?.value,
      address: this.updateForm.get('direccion')?.value
    };

    const userDto = {
      name: this.updateForm.get('username')?.value,
      email: this.updateForm.get('email')?.value,
      password: this.updateForm.get('password')?.value
    };

    return {
      personDto: personDto,
      userDto: userDto
    };
  }





}
