import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  productos = [];

  productoForm: FormGroup;
  ProductoData = {
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: null  // Cambiar de string a null
  };
  categorias = [
    {
      titulo: 'Televisores',
      imagen: 'https://gigantedelhogar.vtexassets.com/arquivos/ids/161687-800-auto?v=638479298028730000&width=800&height=auto&aspect=true'
    },
    {
      titulo: 'Electrodomésticos',
      imagen: 'https://www.elpais.com.co/resizer/v2/TGVVZATTDJGO7D3AW2P3RQDY5E.jpg?auth=6fa364375f4dcab7686a66224ba9cf5aa99a13461fb4f3fe3695b0c4a58e205b&smart=true&quality=75&width=1280&height=720'
    },
    {
      titulo: 'Sonido',
      imagen: 'https://cdn1.totalcommerce.cloud/laplazamorada/product-image/es/equipo-de-sonido-teatro-en-casa-minicomponente-modelo-1-1.webp'
    },
    {
      titulo: 'Repuestos',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAUevpqZG-qTxFkjyyUN749ENDu0f8_uEXiw&s'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    // Llamar a la función para listar productos al cargar el componente
    this.listarProductos();

    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
    
  }

  agregarAlCarrito(producto: any): void {
    console.log('Producto agregado al carrito:', producto);
    // Lógica para agregar el producto al carrito
  }

  verMasInformacion(producto: any): void {
    console.log('Ver más información de:', producto);
    // Lógica para redirigir a una página de detalles del producto o mostrar más información
  }

  agregarAFavoritos(producto: any): void {
    console.log('Producto agregado a favoritos:', producto);
    // Lógica para agregar el producto a una lista de favoritos
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ProductoData.imagen = file; // Asigna el archivo directamente
      console.log('Imagen cargada:', this.ProductoData.imagen); 
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
 

  // Función para convertir la imagen en base64 a un Blob si es necesario
  dataURLtoBlob(dataURL: string): Blob {
    const parts = dataURL.split(',');
    if (parts.length !== 2) {
      throw new Error('El Data URL está mal formado.');
    }

    const base64Data = parts[1];
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: 'image/*' });
  }
}
