import { map } from "rxjs/operators";
import { CartComponent } from "./../cart/cart.component";
import { Component, OnInit } from "@angular/core";
import { ProductService } from "app/services/product.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CartServiceService } from "app/services/cart-service.service";
import { PublicidadServiceService } from "app/services/Publicidad/publicidad-service.service";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import { response } from "express";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { GrupoServiceService } from "app/services/Grupo/grupo-service.service";

@Component({
  selector: "main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  productos = [];
  marcas: [];
  publicidad = [];
  ofertas = []
  descuentos = [];
  promociones =[];
  listCategorias = []
  categoriasForm = [];
  grupos =[]

  //Aqui se guardaran los productos
  carrito: any[] = [];

  productoForm: FormGroup;
  cart =[]
  ProductoData = {
    nombre_producto: "",
    descripcion_producto: "",
   
    precio_producto: "",
    imagen: null, // Cambiar de string a null
  };
  categorias1 = [
    {
      titulo: 'Productos de Línea Blanca',
      imagen: 'assets/img/4.png'
    },
    {
      titulo: 'Productos de Línea Marrón',
      imagen: 'assets/img/6.png'
    },
    {
      titulo: 'Promociones Semanales',
      imagen: 'assets/img/promociones.png'
    },
    {
      titulo: 'Todos nuestros Productos',
      imagen: 'assets/img/tienda.png'
    }
  ];
  

  categorias = [
    {
      titulo: "Televisores",
      imagen:
        "https://gigantedelhogar.vtexassets.com/arquivos/ids/161687-800-auto?v=638479298028730000&width=800&height=auto&aspect=true",
    },
    {
      titulo: "Electrodomésticos",
      imagen:
        "https://www.elpais.com.co/resizer/v2/TGVVZATTDJGO7D3AW2P3RQDY5E.jpg?auth=6fa364375f4dcab7686a66224ba9cf5aa99a13461fb4f3fe3695b0c4a58e205b&smart=true&quality=75&width=1280&height=720",
    },
    {
      titulo: "Sonido",
      imagen:
        "https://cdn1.totalcommerce.cloud/laplazamorada/product-image/es/equipo-de-sonido-teatro-en-casa-minicomponente-modelo-1-1.webp",
    },
    {
      titulo: "Repuestos",
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAUevpqZG-qTxFkjyyUN749ENDu0f8_uEXiw&s",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cartsService: CartServiceService,
    private publicidadService: PublicidadServiceService,
    private marcaService: MarcasServiceService,
    private grupoService: GrupoServiceService,
    private serviceCategoria: CategoriaServiceService
  ) {}

  ngOnInit(): void {
    // Llamar a la función para listar productos al cargar el componente
    this.listarProductos();

    this.productoForm = this.fb.group({
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required],
      precio: ["", [Validators.required, Validators.min(0)]],
    });

    this.obtenerImagenesPorTipo("1"); // Asegúrate de pasar el idTipo correcto
    this.obtenerIamgenesOfertas("2")
    this.obtenerImagenesDescuentos("3")
    this.listarMarcas();
    this.obtenerCategorias();
    this.listarGrupos();
    
  }

  // Método para navegar a la categoría específica
// Método para navegar a las categorías del grupo
navigateToCategoryforGroups(id_grupo: number[]): void {
  console.log('Navegando a el grupo con IDs:', id_grupo);
  this.router.navigate(['/groups', id_grupo]); // Pasar las categorías como un objeto
}
  listarGrupos(): void {
    this.grupoService.listarGrupos().subscribe(
      (response) => {
        this.grupos = response.data.map((grupo) => {
          if (grupo.icono_grupo) {
            grupo.imagen = grupo.icono_grupo;
          }
          // Asegúrate de que 'categorias' sea un array
          if (!Array.isArray(grupo.categorias)) {
            grupo.categorias = [grupo.categorias]; // Convierte a array si no lo es
          }
          return grupo;
        });
        console.log("Grupos:", this.grupos);
      },
      (error) => {
        console.error("Error al obtener los Grupos", error);
      }
    );
}

  obtenerImagenesDescuentos(idTipo):void{
    this.publicidadService.listarImagenesPorTipo(idTipo).subscribe(
      (response) => {
        this.descuentos = response.data.map((pulicidadIm) => {
          if (pulicidadIm.url_imagen_publicitaria) {
            pulicidadIm.imagen = pulicidadIm.url_imagen_publicitaria;
          }

          return pulicidadIm;
        });

        console.log("Imágenes por tipo:", this.publicidad);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }

    // Método para navegar a la categoría específica
    navigateToCategory(id_categoria: number): void {
      console.log('Navegando a la categoría con ID:', id_categoria);
      this.router.navigate(['/products', id_categoria]);
    }

      // Método para navegar a la categoría específica
      navigateToCategoryandProduct(id_imagen: number): void {
        console.log('Navegando el producto con ID:', id_imagen);
        this.router.navigate(['/product', id_imagen]);
      }
      
    

  obtenerCategorias():void{
    this.serviceCategoria.listarCategorias().subscribe(
      (response) => {
        this.listCategorias = response.data.map((listcategorias) => {
          if (listcategorias.logo_categoria) {
            listcategorias.imagen = listcategorias.logo_categoria;
          }

          return listcategorias;
        });

        console.log("Categorias:", this.listCategorias);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }

  obtenerIamgenesOfertas(idTipo):void{
    this.publicidadService.listarImagenesPorTipo(idTipo).subscribe(
      (response) => {
        this.ofertas = response.data.map((pulicidadIm) => {
          if (pulicidadIm.url_imagen_publicitaria) {
            pulicidadIm.imagen = pulicidadIm.url_imagen_publicitaria;
          }

          return pulicidadIm;
        });

        console.log("Imágenes por tipo:", this.publicidad);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }

  obtenerImagenesPorTipo(idTipo: string): void {
    this.publicidadService.listarImagenesPorTipo(idTipo).subscribe(
      (response) => {
        this.publicidad = response.data.map((pulicidadIm) => {
          if (pulicidadIm.url_imagen_publicitaria) {
            pulicidadIm.imagen = pulicidadIm.url_imagen_publicitaria;
          }

          return pulicidadIm;
        });

        console.log("Imágenes por tipo:", this.publicidad);
      },
      (error) => {
        Swal.fire("Error", "No se pudieron obtener las imágenes", "error");
        console.error("Error al obtener las imágenes por tipo:", error);
      }
    );
  }



  agregarAlCarrito(producto: any): void {
    this.cartsService.agregarProducto(producto);
    this.cart = this.cartsService.obtenerCarrito(); // Actualiza el carrito
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Producto agregado al carrito",
    });
  }
  verMasInformacion(producto: any): void {
    console.log("Ver más información de:", producto);
    // Lógica para redirigir a una página de detalles del producto o mostrar más información
  }

  agregarAFavoritos(producto: any): void {
    console.log("Producto agregado a favoritos:", producto);
    // Lógica para agregar el producto a una lista de favoritos
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ProductoData.imagen = file; // Asigna el archivo directamente
      console.log("Imagen cargada:", this.ProductoData.imagen);
    }
  }

  listarProductos(): void {
    this.productService.listarProductos().subscribe(
      (response) => {
        this.productos = response.data.map((producto) => {
          if (producto.url_imagen) {
            producto.imagen = producto.url_imagen;
          }
          return producto;
        });
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
  }

  listarMarcas(): void {
    this.marcaService.listarMarcas().subscribe(
      (response) => {
        this.marcas = response.data.map((marca) => {
          if (marca.logo_marca) {
            marca.imagen = marca.logo_marca;
          }
          return marca;
        });
        console.log("MARCAS:", this.marcas);
      },
      (error) => {
        console.error("Error al obtener Productos", error);
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
