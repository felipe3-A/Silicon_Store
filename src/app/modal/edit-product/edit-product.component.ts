import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductService } from 'app/services/product.service';

@Component({
  selector: 'edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {

  @Input() productoSeleccionado: any = {} 
  @Output() closeModal = new EventEmitter<void>();
  @Output() actualizarProducto = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>(); // Emite un evento para cerrar el modal

  constructor(private productoService: ProductService) { }

  isValidDecimal(value: string): boolean {
    return !isNaN(parseFloat(value)) && /^\d+(\.\d{1,2})?$/.test(value);
  }
  
  actuProducto(): void {
    // Validar si el precio es válido
    if (!this.isValidDecimal(this.productoSeleccionado.precio)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio proporcionado no es válido. Por favor, ingresa un precio correcto.'
      });
      return;
    }
  
    // Crear el objeto del producto actualizado
    const productoActualizado = {
      nombre: this.productoSeleccionado.nombre,
      descripcion: this.productoSeleccionado.descripcion,
      precio: parseFloat(this.productoSeleccionado.precio.trim()),  // Asegurarse de que el precio esté limpio
      imagen: this.productoSeleccionado.imagen || ''  // Usar la imagen actual si no se especifica una nueva
    };
  
    // Llamada al servicio para actualizar el producto
    this.productoService.editarProducto(this.productoSeleccionado.id, productoActualizado).subscribe(
      response => {
        console.log('Producto actualizado:', response);
        this.closeModal.emit();  // Cerrar el modal
        this.actualizarProducto.emit();  // Notificar que el producto ha sido actualizado
        Swal.fire({
          icon: 'success',
          title: '¡Producto actualizado!',
          text: 'El producto ha sido actualizado correctamente.'
        });
        this.productoSeleccionado = {};  // Limpiar los valores si es necesario
      },
      error => {
        console.error('Error al actualizar el producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar actualizar el producto. Por favor, inténtalo de nuevo.'
        });
      }
    );
  }
  
  
  

  // Método para cerrar el modal
  cerrarModal(): void {
    this.close.emit(); // Emite el evento al padre para cerrar el modal
  }

  ngOnInit(): void {
    // Se puede agregar lógica adicional si es necesario
  }
}
