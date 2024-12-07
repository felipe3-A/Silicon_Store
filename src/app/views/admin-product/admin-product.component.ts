import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  productos = [];
  productoForm: FormGroup;
  ProductoData: any = { nombre: '', descripcion: '', precio: '', imagen: null, categoria:'',referencia:'',cantidad:'' };
  @ViewChild('modalContent') modalContent: ElementRef<any> | null = null;

  showModal: boolean = false;  // Modal de ver
  showModal1: boolean = false; // Modal de editar
  productoSeleccionado: any = {};
  mostarMEditar: boolean = false;
  mostarMVer: boolean = false;
  idProductoEditar: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      imagen: [''],
      cantidad:[],
      categoria:[],
      referencia:[],
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

  closeModal(): void {
    this.showModal = false;
    this.showModal1 = false; // Asegúrate de cerrar ambos modales
  }

  abrirModalVer(producto: any): void {
    this.productoSeleccionado = producto;
    this.showModal = true;  // Abre el modal de ver
    this.showModal1 = false; // Cierra el modal de editar
  }

  abrirModalEditar(productos: any): void {
    this.ProductoData = { ...productos }; // Copia el producto recibido
    this.showModal1 = true; // Abre el modal de edición
    this.showModal = false; // Cierra el modal de ver
  }

  listarProductos(): void {
    this.productService.listarProductos().subscribe(
      (response) => {
        console.log('Respuesta del servicio:', response);
        this.productos = response.data || response; // Ajusta esto según el formato real de la respuesta
      },
      (error) => {
        console.log('Error al obtener Productos', error);
      }
    );
  }

  crearProducto() {
    if (this.productoForm.valid) {
      const producto = { ...this.productoForm.value, precio: parseFloat(this.productoForm.get('precio')?.value) };
  
      this.productService.crearProducto(producto).subscribe(
        response => {
          Swal.fire('¡Éxito!', 'Producto creado exitosamente', 'success').then(() => {
            // Limpiar el formulario
            this.productoForm.reset();
            // Llamar al método que actualiza la lista de productos
            this.listarProductos();
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
  

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Seguro que quieres borrar este producto permanentemente?',
      text: 'No se puede volver a recuperar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.eliminarProducto(id).subscribe(
          () => {
            Swal.fire('¡Éxito!', 'Producto Eliminado exitosamente', 'success');
            this.listarProductos(); // Actualizamos la lista de productos
          },
          (error) => {
            Swal.fire('¡Error!', 'El producto no se pudo borrar', 'error');
          }
        );
      }
    });
  }
}

