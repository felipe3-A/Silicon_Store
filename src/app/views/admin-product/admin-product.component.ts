import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {

  productos = [];

  productoForm: FormGroup;
  ProductoData : any = {
    nombre: '',
    descripcion: '',
    precio: '',
    imagen:null
  };
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) { }
  

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      imagen: [''],
      precio: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
    

    this.listarProductos();
  }
  formatDecimal(fieldName: string): void {
    const control = this.productoForm.get(fieldName);
    if (control?.value) {
      const formattedValue = parseFloat(control.value).toFixed(2);
      control.setValue(formattedValue, { emitEvent: false });
    }
  }
  
  

  listarProductos(): void {
    this.productService.listarProductos().subscribe(
      (response) => {
        console.log('Respuesta del servicio:', response);
        this.productos = response.data || response; // Ajusta esto según el formato real de la respuesta
        console.log('Productos:', this.productos);
      },
      (error) => {
        console.log('Error al obtener Productos', error);
      }
    );
  }
  

  crearProducto() {
    if (this.productoForm.valid) {
      const producto = { 
        ...this.productoForm.value, 
        precio: parseFloat(this.productoForm.get('precio')?.value) 
      };
  
      this.productService.crearProducto(producto).subscribe(
        response => {
          Swal.fire('¡Éxito!', 'Producto creado exitosamente', 'success').then(() => {
            this.productoForm.reset();
          }).then((response)=>{
            this.router.navigate(['/store'])
          });
        },
        error => {
          Swal.fire('Error', 'Ocurrió un error al crear el producto.', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Por favor complete correctamente el formulario.', 'warning');
    }
  }
  //
  
  
  

}
