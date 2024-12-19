import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartServiceService {
  private carrito: any[] = [];
  private totalSubject = new BehaviorSubject<number>(0);

  // Observable para el total
  total$ = this.totalSubject.asObservable();

  obtenerCarrito() {
    return this.carrito;
  }

  agregarProducto(producto: any) {
    this.carrito.push(producto);
    this.actualizarTotal();
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarTotal();
  }

  // Calcula el total y actualiza el BehaviorSubject
  private actualizarTotal() {
    const total = this.carrito.reduce((acc, producto) => acc + (producto.precio || 0), 0);
    this.totalSubject.next(total);
  }

  eliminarProductoC(producto: any): void {
    // Filtramos el carrito para eliminar el producto especificado
    this.carrito = this.carrito.filter(p => p.id !== producto.id);
  }
}
