import { UsuarioService } from './../../services/usuarios/usuario-service.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CartServiceService } from 'app/services/cart-service.service';

@Component({
  selector: "app-buy-product",
  templateUrl: "./buy-product.component.html",
  styleUrls: ["./buy-product.component.css"],
})
export class BuyProductComponent implements OnInit {
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  currentStep = 1;
  carrito: any[] = [];
  total: number = 0;
  informaciovalida = false;

  producto = {
    nombre: "Producto Ejemplo",
    precio: 100,
    marca: "Marca Ejemplo",
    descripcion: "Descripción del producto",
    fechaEntrega: "2024-12-20",
  };

  metodosDePago = [
    { nombre: "Nequi", icon: "assets/img/nequi.jpg", selected: false },
    {
      nombre: "Bancolombia",
      icon: "assets/img/bancolombia.jpg",
      selected: false,
    },
    { nombre: "Efecty", icon: "assets/img/efecty.jpg", selected: false },
    { nombre: "Visa", icon: "assets/img/visa.jpg", selected: false },
    {
      nombre: "Tarjeta de Crédito",
      icon: "assets/img/targeta.jpg",
      selected: false,
    },
    {
      nombre: "Daviplata",
      icon: "assets/img/daviplata.jpg",
      selected: false,
    },
  ];

  metodoSeleccionado: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cartService : CartServiceService
  ) {}

  ngOnInit(): void {
    this.carrito = this.cartService.obtenerCarrito();

    // Formulario paso 1: Correo electrónico
    this.step1Form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });

  // Formulario paso 2: Datos del usuario
this.step2Form = this.fb.group({
  nombre: ['', [Validators.required]],
  identificacion: ['', [Validators.required]],
  telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  direccion: ['', [Validators.required]],
});

// Formulario paso 3: Métodos de pago
this.step3Form = this.fb.group({
  pago: ["", [Validators.required]],
  comentarios: [""],
});


    this.step4Form = this.fb.group({
      metodoPago: [null, Validators.required], // Aquí puedes agregar los campos necesarios
    });
    

    // Obtenemos el total del carrito
    this.cartService.total$.subscribe((nuevoTotal) => {
      this.total = nuevoTotal;
    });
  }

  calcularTotal(): number {
    if (!this.carrito || this.carrito.length === 0) {
      return 0;
    }
    return this.carrito.reduce(
      (total, producto) => total + (producto.precio || 0),
      0
    );
  }

  submitForms(): void {
    if (this.step1Form.valid && this.step2Form.valid && this.step3Form.valid && this.step4Form.valid) {
      const formData = {
        ...this.step1Form.value,
        ...this.step2Form.value,
        ...this.step3Form.value,
        metodoPago: this.step4Form.get('metodoPago')?.value,
      };
  
      // Llamada al servicio para crear el usuario
      this.usuarioService.crearUsuario(formData).subscribe(
        (response) => {
          console.log('Usuario creado exitosamente:', response);
          alert('¡Compra finalizada con éxito!');
        },
        (error) => {
          console.error('Error al crear el usuario:', error);
          alert('Hubo un error al procesar la compra. Intenta nuevamente.');
        }
      );
    } else {
      console.log('Uno o más formularios no son válidos.');
    }
  }
  

  validarInformacion(): void {
    console.log('Click en un boton');
    this.informaciovalida = true;
  }

  nextStep(): void {
    console.log('Current step:', this.currentStep);
  
    if (this.currentStep === 1 && this.step1Form.valid) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.step2Form.valid) {
      this.currentStep++;
    } else if (this.currentStep === 3 && this.step3Form.valid) {
      this.currentStep++;
    } else if (this.currentStep === 4 && this.step4Form.valid) {
      this.currentStep++;
    } else {
      console.log('Formulario inválido en el paso:', this.currentStep);
    }
  }
  
  


  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onEnvioChange(): void {
    // Lógica cuando cambia el método de envío (presencial o domicilio)
    if (this.step2Form.get("envio")?.value === "domicilio") {
      // Mostrar formulario de domicilio
    } else {
      // Mostrar formulario de compra presencial
    }
  }

  selectMetodo(metodo: any): void {
    this.metodosDePago.forEach((m) => (m.selected = false)); // Reinicia selección
    metodo.selected = true; // Marca como seleccionado
    this.metodoSeleccionado = metodo; // Asigna el método seleccionado
    this.step4Form.patchValue({ metodoPago: metodo.nombre }); // Actualiza el formulario
  }
  
  



  printFactura(): void {
    // Lógica para imprimir la factura
    console.log("Imprimir factura con los datos:", {
      ...this.step1Form.value,
      ...this.step2Form.value,
      ...this.step3Form.value,
      ... this.step4Form.value,

      metodoPago: this.metodoSeleccionado,
    });
  }
}
