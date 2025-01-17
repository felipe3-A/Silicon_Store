import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarcasServiceService } from 'app/services/Marcas/marcas-service.service';
import { ProductService } from 'app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'unidad-producto',
  templateUrl: './unidad-producto.component.html',
  styleUrls: ['./unidad-producto.component.css']
})
export class UnidadProductoComponent implements OnInit {
  id_imagen!: number; // ID del producto seleccionado
  categoriaId!: number; // ID de la categoría del producto
  idMarca!: number;
  productosSimilares: any[] = []; // Lista de productos similares
  productoListado: any[] = [];
  archivos: any[] = [];
  galeriaImagenes: string[] = []; // Cambiado a un array para almacenar las imágenes de la galería
  previsualizacion: string = "";
  imagenPrincipal: string = 'https://www.neolo.com/blog/wp-content/uploads/2019/10/que-es-error-500.jpg';
  marcas:[]

  constructor(
    private serviceImagen: ProductService,
    private route: ActivatedRoute,
    private marcaService: MarcasServiceService
  ) {}

  ngOnInit(): void {
    // Capturar los parámetros de la URL
    this.categoriaId = +this.route.snapshot.paramMap.get('id_categoria')!;
    this.id_imagen = +this.route.snapshot.paramMap.get('id_imagen')!;

    console.log('Parámetros de la URL:', {
      id_categoria: this.categoriaId,
      id_imagen: this.id_imagen,
    });

    // Cargar productos similares basados en la categoría
    
    // Cargar el producto seleccionado
    this.cargarProductoSeleccionado(this.id_imagen);
    this.cargarLogosPorProducto(this.idMarca)
  }

  cambiarImagenPrincipal(index: number): void {
    this.imagenPrincipal = this.galeriaImagenes[index]; // Cambiar a la imagen de la galería
  }

  


  cargarProductoSeleccionado(id_imagen: number): void {
    this.serviceImagen.listarProductoId(id_imagen).subscribe(
      (response) => {
        if (response && response.data) {
          this.productoListado = [response.data]; // Asignar el objeto de producto a un array
          this.imagenPrincipal = this.productoListado[0]?.url_imagen || 'ruta/por/defecto.png';
          
          // Cargar las imágenes de la galería
          this.cargarImagenesGaleria(this.productoListado[0]?.id_galeria);
        } else {
          console.error('Producto no encontrado o datos inválidos:', response);
        }
      },
      (error) => {
        console.error('Error al obtener el producto seleccionado:', error);
      }
    );
  }

  
  cargarLogosPorProducto(id_marca: number): void {
    this.marcaService.obtenerMarcaPorId(id_marca).subscribe(

    );
  }

  cargarImagenesGaleria(id_galeria: number): void {
    this.serviceImagen.obtenerGaleriaPorId(id_galeria).subscribe(
      (response) => {
        if (response && response.data) {
          this.galeriaImagenes = JSON.parse(response.data.url_imagenes); // Asegúrate de que `url_imagenes` es un array de URLs
          console.log('Imágenes de la galería:', this.galeriaImagenes);
        } else {
          console.error('No se encontraron imágenes para esta galería:', response);
        }
      },
      (error) => {
        console.error('Error al obtener las imágenes de la galería:', error);
      }
    );
  }
  

  capturarFile(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/avif",
        "image/webp",
      ];
      if (!tiposPermitidos.includes(archivo.type)) {
        Swal.fire(
          "Error",
          "El archivo debe ser una imagen (JPEG/PNG/JPG/AVIF/WEBP)",
          "error"
        );
        return;
      }
      this.archivos.push(archivo);
      this.extraerBase64(archivo).then((imagen: any) => {
        this.previsualizacion = imagen.base || "";
      });
    }
  }

  extraerBase64 = async (file: File) =>
    new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ base: reader.result });
        reader.onerror = () => resolve({ base: null });
      } catch {
        resolve({ base: null });
      }
    });
}