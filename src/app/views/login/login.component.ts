import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/usuarios/login-service.service"
import { Router } from '@angular/router'; // Importar Router desde '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  showPassword: boolean = false; // Propiedad para controlar si se muestra la contraseña o no
  passwordFocused: boolean = false;
  usuarios = {
    email: '',
    password: ''
  };
  errorMessage: string = ''; // Propiedad para almacenar el mensaje de error

 
  constructor(private loginService: LoginService, private router: Router) { }

  //Volver al home 
  ngOnInit(){}
  backToHome(){
    this.router.navigate([''])
  }
  //Cerrando el ciclo

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Cambia el estado de la propiedad para mostrar/ocultar la contraseña
  }

  onSubmit() {
    console.log('LoginService:', this.loginService);
    if (!this.loginService.postLogin) {
      console.error('Método postLogin no definido');
      return;
    }
    this.loginService.postLogin(this.usuarios).subscribe(response => {
      console.log('Inicio de sesión exitoso', response);
      this.router.navigate(['/main']);
    }, error => {
      console.error('Error al iniciar sesión', error);
      this.errorMessage = error.error?.error || 'Usuario y Contraseña incorrectos';
    });
  }
  



}
