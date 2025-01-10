import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/services/product.service';
import Swal from "sweetalert2";

@Component({
  selector: 'ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})
export class VerProductosComponent implements OnInit {

  productos = []; // Variable para almacenar los productos
  id_categoria: number = 1; // Cambia esto según la categoría seleccionada

  constructor(
    private serviceImages: ProductService
  ) { }

  ngOnInit(): void {
    this.cargarProductos("1");

  }

  cargarProductos(idCategoria): void {
    this.serviceImages.listarProductosPorCategoria(idCategoria).subscribe(
      (response) => {
        console.log("Respuesta de la API:", response); // Confirmar estructura
        if (Array.isArray(response)) {
          this.productos = response.map((producto) => {
            if (producto.url_imagen) {
              producto.imagen = producto.url_imagen;
            }
            return producto;
          });
        } else {
          console.error("Formato inesperado de respuesta:", response);
        }
  
        console.log("Productos procesados:", this.productos);
      },
      (error) => {
        console.error("Error al obtener los productos:", error);
      }
    );
  }
  
  


           // Función para convertir la imagen en base64 a un Blob si es necesario
  dataURLtoBlob(dataURL: string): Blob {
    const parts = dataURL.split(",");
    if (parts.length !== 2) {
      throw new Error("El Data URL está mal formado.");
    }

    const base64Data = parts[1];
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: "image/*" });
  }
   
}
