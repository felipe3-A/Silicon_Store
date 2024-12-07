import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  constructor() { }

  private carrito: any[] = [];

  agregarProducto(producto: any): void {
    this.carrito.push(producto);
  }

  obtenerCarrito(): any[] {
    return this.carrito;
  }
}
