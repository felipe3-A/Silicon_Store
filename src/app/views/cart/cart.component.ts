import { Component, OnInit } from "@angular/core";
import { CartServiceService } from "app/services/cart-service.service";
import * as CryptoJS from 'crypto-js';

declare var BoldCheckout: any; // Declaración de la variable

@Component({
  selector: "cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  carrito: any[] = [];
  checkout: any; // Para almacenar la instancia de BoldCheckout

  constructor(private cartService: CartServiceService) {}

  ngOnInit(): void {
    this.carrito = this.cartService.obtenerCarrito();
    this.initBoldCheckout(); // Inicializa la pasarela de pagos
  }

  calcularTotal(): number {
    if (!this.carrito || this.carrito.length === 0) {
      return 0; // Si el carrito está vacío, retorna 0
    }
    return this.carrito.reduce(
      (total, producto) => total + (producto.precio_producto || 0),
      0
    );
  }

  eliminarProductoC(producto: any): void {
    this.cartService.eliminarProductoC(producto);
    this.carrito = this.cartService.obtenerCarrito();
  }

  iniciarPago(): void {
    console.log("Iniciando el proceso de pago...");
    if (this.checkout) {
      this.checkout.open();
    }
  }

  // Nueva función asincrónica para generar el hash SHA-256
  async generateIntegritySignature(orderId: string, amount: number, currency: string): Promise<string> {
    const secretKey = "q8s-fXDRxrUC0cdpCJAKsA"; // Reemplaza con tu clave secreta
    const cadenaConcatenada = `${orderId}${amount}${currency}${secretKey}`;

    // Codificar la cadena en UTF-8
    const encodedText = new TextEncoder().encode(cadenaConcatenada);

    // Generar el hash SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);

    // Convertir el buffer del hash en un array de bytes
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convertir cada byte en una representación hexadecimal y unirlos en una sola cadena
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async initBoldCheckout() {
    const orderId = "MY-ORDER-" + Date.now();
    const totalAmount = this.calcularTotal();
    const currency = "COP";
    const products= "Lampara LG - Televisor 40.000"

    // Generar la firma de integridad usando la función asincrónica
    const integritySignature = await this.generateIntegritySignature(orderId, totalAmount, currency);

    this.checkout = new BoldCheckout({
      orderId: orderId,
      currency: currency,
      amount: totalAmount, // Pasa el monto calculado dinámicamente
      apiKey: "rAWnCUsKaJxYoFDXYjvMe7qukQHodJgC9ifkvIOHqTE",
      redirectionUrl: "https://micomercio.com/pagos/resultado",
      description: "Pago de productos en mi tienda:",
      integritySignature: integritySignature, // Firma generada dinámicamente
    });
  }
}
