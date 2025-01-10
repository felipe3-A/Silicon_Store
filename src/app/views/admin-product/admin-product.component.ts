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

@Component({
  selector: "admin-product",
  templateUrl: "./admin-product.component.html",
  styleUrls: ["./admin-product.component.css"],
})
export class AdminProductComponent implements OnInit {
  @ViewChild("modalContent") modalContent: ElementRef<any> | null = null;

  productos = [];
  productosFiltrados: any[] = [];
  productoForm: FormGroup;
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
  categoriasForm= []
  marcasForm = []

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private serviceCategoria: CategoriaServiceService,
    private marcaService : MarcasServiceService,
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre_producto: ["", [Validators.required]],
      descripcion_producto: ["", [Validators.required]],
      url_imagen: ["", [Validators.required]],
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

    this.showModal=false;
    this.mostrarModalEditar=false;
  }

  listarMarcas(): void{
    this.marcaService.listarMarcas().subscribe(
      (response)=>{
        console.log("MARCAS listadas", response.data);
        this.marcasForm = response.data
      },
       (error) => { // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar las marcas", error);
      }
    )
  }

  listarCategorias(): void {
    this.serviceCategoria.listarCategorias().subscribe(
      (response)=>{
        console.log("Categorias Listadas:", response.data);
        this.categoriasForm = response.data;
      },
      (error) => { // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar las categorias", error);
      }
    )

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
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    if (this.archivos.length > 0) {
      formData.append("image", this.archivos[0]);
    }

    Object.keys(this.productoForm.controls).forEach((key) => {
      const controlValue = this.productoForm.get(key)?.value;
      console.log(key, controlValue); // Verifica que no esté siendo undefined
      if (controlValue === undefined || controlValue === "") {
        formData.append(key, null);
      } else {
        formData.append(key, controlValue); // Si el valor es undefined, agregar null
      }
    });
    this.productService.crearProducto(formData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Producto creado correctamente", "success");
        this.listarProductos();
        this.productoForm.reset();
        this.archivos = [];
        this.previsualizacion = "";
      },
      error: () => Swal.fire("Error", "No se pudo crear el producto", "error"),
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
