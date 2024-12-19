import { Component, OnInit } from '@angular/core';
import { CartServiceService } from 'app/services/cart-service.service';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  carrito: any[] = [];

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.carrito = this.cartService.obtenerCarrito();
  }

  calcularTotal(): number {
    if (!this.carrito || this.carrito.length === 0) {
      return 0; // Si el carrito está vacío, retorna 0
    }
    return this.carrito.reduce((total, producto) => total + (producto.precio || 0), 0);
  }

  eliminarProductoC(producto: any): void {
    // Llamamos al servicio para eliminar el producto del carrito
    this.cartService.eliminarProductoC(producto);
    // Actualizamos la vista después de eliminar el producto
    this.carrito = this.cartService.obtenerCarrito();
  }
}
