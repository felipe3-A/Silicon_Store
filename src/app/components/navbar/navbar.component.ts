import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CartServiceService } from 'app/services/cart-service.service'; // Asegúrate de importar tu servicio
import { LoginService } from 'app/services/usuarios/login-service.service';
import { TokenValidationService } from '../../services/VerificacionUser/token-validation.service';
import { UsuarioService } from 'app/services/usuarios/usuario-service.service';
import { AuthServiceService } from 'app/services/AuthService/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  location: Location;
  mobile_menu_visible: any = 0;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  nombre: string = '';
  private toggleButton: any;
  cart: any[] = []; // Propiedad para almacenar los datos del carrito
  messages: string[] = [
    "Somos Silicon",
    "Innovación a tu alcance",
    "Calidad y confianza",
    "Tu tienda de tecnología",
    "Experiencia y servicio"
  ];
  currentMessage: string = this.messages[0];

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private loginService: LoginService,
    private userSrervice: UsuarioService,
    private tokenvalidationService: TokenValidationService,
    private cartService: CartServiceService, // Inyecta el servicio del carrito
    private authService: AuthServiceService,
  ) {
    this.location = location;
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    
    this.authService.getUserRole().subscribe((role: string) => {
      this.isAdmin = role === 'admin';
    });

    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe(() => {
      this.closeMobileMenu();
    });

    this.cartService.cartUpdated.subscribe(cart => {
      this.cart = cart; // Actualiza el carrito en el componente
    });
  

    this.loginService.loginStatusChanged.subscribe(status => {
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', JSON.stringify(status));
      if (status) {
        this.fetchUsername();
      } else {
        this.nombre = '';
      }
    });

    // Inicializar el cambio de mensajes
    this.startMessageRotation();

    // Inicializar el carrito
    this.cart = this.cartService.obtenerCarrito();
  }


    abrirCarrito() {
      this.router.navigate(['/cart']); // Usa paréntesis para llamar a la función
    }
  

  startMessageRotation() {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.messages.length);
      this.currentMessage = this.messages[randomIndex];
    }, 3000);
  }

  closeMobileMenu() {
    const $layer: any = document.getElementsByClassName('close-layer')[0];
    if ($layer) {
      $layer.remove();
      this.mobile_menu_visible = 0;
    }
  }

  toggleMobileMenu() {
    const $toggle = document.getElementsByClassName('navbar-toggler')[0];
    const body = document.getElementsByTagName('body')[0];

    if (this.mobile_menu_visible === 1) {
      body.classList.remove('nav-open');
      const $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
      setTimeout(() => {
        $toggle.classList.remove('toggled');
      }, 400);
      this.mobile_menu_visible = 0;
    } else {
      setTimeout(() => {
        $toggle.classList.add('toggled');
      }, 430);

      const $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');

      if (body.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      }

      setTimeout(() => {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = () => {
        body.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(() => {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      };

      body.classList.add('nav-open');
      this.mobile_menu_visible = 1;
    }
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    return 'Dashboard'; // Puedes agregar lógica para otros títulos si lo necesitas
  }

  private fetchUsername(): void {
    const storedToken = this.tokenvalidationService.getToken();
    if (storedToken) {
      const userId = this.tokenvalidationService.getUserData(storedToken).userId;
      this.userSrervice.obtenerUsuarioId(userId).subscribe(
        response => {
          if (response && response.user) {
            this.nombre = response.data.nombre;
          } else {
            console.error('Faltan datos de usuario en la respuesta');
          }
        },
        error => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    }
  }
}
