import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartServiceService {
  private carrito: any[] = [];
  private totalSubject = new BehaviorSubject<number>(0);
  cartUpdated = new Subject<any[]>(); // Subject para emitir cambios en el carrito

  // Observable para el total
  total$ = this.totalSubject.asObservable();

  agregarProducto(producto: any) {
    this.carrito.push(producto);
    this.actualizarTotal();
    this.cartUpdated.next(this.carrito); // Emitir el nuevo carrito
  }

  eliminarProducto(index: number) {
    this.carrito.splice(index, 1);
    this.actualizarTotal();
    this.cartUpdated.next(this.carrito); // Emitir el nuevo carrito
  }

  eliminarProductoC(producto: any): void {
    // Filtramos el carrito para eliminar el producto especificado
    this.carrito = this.carrito.filter(p => p.id !== producto.id);
    this.actualizarTotal();
    this.cartUpdated.next(this.carrito); // Emitir el nuevo carrito
  }

  obtenerCarrito(): any[] {
    return this.carrito;
  }

  // Calcula el total y actualiza el BehaviorSubject
  private actualizarTotal() {
    const total = this.carrito.reduce((acc, producto) => acc + (producto.precio || 0), 0);
    this.totalSubject.next(total);
  }
}