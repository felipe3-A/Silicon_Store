import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ProductService } from "app/services/product.service";
import { Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";
import Swal from "sweetalert2";
import { CategoriaServiceService } from "app/services/Categoria/categoria-service.service";
import { MarcasServiceService } from "app/services/Marcas/marcas-service.service";
import { response } from "express";
import { GrupoServiceService } from "app/services/Grupo/grupo-service.service";

@Component({
  selector: "admin-product",
  templateUrl: "./admin-product.component.html",
  styleUrls: ["./admin-product.component.css"],
})
export class AdminProductComponent implements OnInit {
  @ViewChild("modalContent") modalContent: ElementRef<any> | null = null;

  productos = [];
  productosFiltrados: any[] = [];
  productoStep1Form: FormGroup;
  productoStep2Form: FormGroup;
  step: number = 1; // Para manejar los pasos

  productoSeleccionado: any = {};
  previsualizacion: string = "";
  archivos: any[] = [];
  terminoBusqueda: string = "";
  noResultados: boolean = false;
  currentPage: number = 1;

  mostrarModalEditar: boolean = false;
  idProductoAEditar: number | null = null;
  pageSize: number = 10;
  showModal: boolean = false; // Modal de ver
  categoriasForm = [];
  gruposForm = [];

  marcasForm = [];
  grupos = [];
  loading: boolean = false; // Variable para controlar el estado de carga

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private serviceCategoria: CategoriaServiceService,
    private marcaService: MarcasServiceService,
    private grupoService: GrupoServiceService
  ) {}

  ngOnInit(): void {

    this.productoStep1Form = this.fb.group({
      nombre_producto: ["", [Validators.required]],
      url_imagen: ["", [Validators.required]],
     
      id_grupo: ["", [Validators.required]],

      
   
    });
    this.productoStep2Form = this.fb.group({
      descripcion_producto: ["", [Validators.required]],
      cantidad_producto: [
        "",
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      id_categoria: ["", [Validators.required]],
      referencia_producto: ["", [Validators.required]],
      garantia_producto: ["", [Validators.required]],
      id_marca: ["", [Validators.required]],

      envio_producto: ["", [Validators.required]],
      precio_producto: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
    });
    this.listarProductos();
    this.listarCategorias();
    this.listarMarcas();
    this.listarGrupos();

    this.showModal = false;
    this.mostrarModalEditar = false;
  }

  capturarGaleria(event: any): void {
    const archivos = event.target.files;
    this.archivos = [];
    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.archivos.push({ url: e.target.result, file: archivo });
      };
      reader.readAsDataURL(archivo);
    }
  }
  listarMarcas(): void {
    this.marcaService.listarMarcas().subscribe(
      (response) => {
        console.log("MARCAS listadas", response.data);
        this.marcasForm = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar las marcas", error);
      }
    );
  }

  listarGrupos(): void {
    this.grupoService.listarGrupos().subscribe(
      (response) => {
        console.log("Grupos listados", response.data);
        this.gruposForm = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar los Grupos", error);
      }
    );
  }

  listarCategorias(): void {
    this.serviceCategoria.listarCategorias().subscribe(
      (response) => {
        console.log("Categorias Listadas:", response.data);
        this.categoriasForm = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar las categorias", error);
      }
    );
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
        this.filtrarProductos();
      },
      (error) => {
        console.error("Error al obtener Productos", error);
      }
    );
  }

  filtrarProductos(): void {
    if (this.terminoBusqueda.trim() !== "") {
      this.productosFiltrados = this.productos.filter((producto) =>
        [
          producto.referencia,
          producto.nombre,
          producto.descripcion,
          producto.precio.toString(),
        ].some((campo) =>
          campo?.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
        )
      );
      this.noResultados = this.productosFiltrados.length === 0;
    } else {
      this.productosFiltrados = [...this.productos];
    }
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

    crearProducto(): void {
      if (this.productoStep2Form.valid) {
        const formData = new FormData();
        const datosPaso1 = this.productoStep1Form.value;
        const datosPaso2 = this.productoStep2Form.value;
  
        Object.keys(datosPaso1).forEach((key) => {
          formData.append(key, datosPaso1[key]);
        });
        Object.keys(datosPaso2).forEach((key) => {
          formData.append(key, datosPaso2[key]);
        });
  
        this.productService.crearProducto(formData).subscribe(() => {
          alert("Producto creado con éxito");
          this.step = 1;
          this.productoStep1Form.reset();
          this.productoStep2Form.reset();
          this.archivos = [];
        });
      } else {
        alert("Completa todos los campos");
      }
    }
  // En tu componente AdminProductComponent
  crearGaleria(): void {
    const formData = new FormData();
    this.archivos.forEach((archivo) => {
      formData.append("imagenes[]", archivo.file);
    });
    this.productService.crearGaleria(formData).subscribe((response: any) => {
      const idGaleria = response.data.id;
      this.productoStep2Form.addControl("id_galeria", this.fb.control(idGaleria));
    });
  }

  eliminarProducto(id_imagen: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar este producto permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.eliminarProducto(id_imagen).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Producto Eliminado exitosamente", "success");
            this.listarProductos();
          },
          () => Swal.fire("¡Error!", "El producto no se pudo borrar", "error")
        );
      }
    });
  }

  abrirModalVer(producto: any): void {
    console.log("Producto seleccionado:", producto); // Depuración
    this.productoSeleccionado = producto;
    this.showModal = true;
  }

  abrirModaEditar(producto: any): void {
    console.log("Producto seleccionado:", this.productoSeleccionado); // Depuración
    this.productoSeleccionado = producto;
    this.mostrarModalEditar = true;
  }
  closeModal(): void {
    this.showModal = false;
    this.mostrarModalEditar = false;
  }

  handleCloseModal(): void {
    this.closeModal();
  }

  actualizarproducto(): void {
    this.listarProductos(); // Llama al método para obtener las empresas nuevamente
  }

  pageChange(event: number): void {
    this.currentPage = event;
  }
}
