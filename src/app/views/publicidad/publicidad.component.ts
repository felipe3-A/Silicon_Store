import { Component, OnInit } from "@angular/core";
import { PublicidadServiceService } from "app/services/Publicidad/publicidad-service.service";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TipoServiceService } from "app/services/Tipo/tipo-service.service";

@Component({
  selector: "publicidad",
  templateUrl: "./publicidad.component.html",
  styleUrls: ["./publicidad.component.css"],
})
export class PublicidadComponent implements OnInit {
  publicidad = [];
  tipos = [];
  archivos: any[] = [];
  PublicidadForm: FormGroup;
  previsualizacion: string = "";
  constructor(
    private publicidadService: PublicidadServiceService,
    private fb: FormBuilder,
    private serviceTipo: TipoServiceService
  ) {}

  ngOnInit(): void {
    this.PublicidadForm = this.fb.group({
      url_imagen_publicitaria: ["", [Validators.required]],
      id_tipo_imagen: ["", [Validators.required]],
      nombre_imagen_publicitaria: ["", [Validators.required]],
    });

    this.obtenerImagenesPublicitarias();
    this.obtenerTiposdePublicidad();
  }

  obtenerTiposdePublicidad(): void {
    this.serviceTipo.listarTipos().subscribe(
      (response) => {
        console.log("Tipos Listados:", response.data);
        this.tipos = response.data;
      },
      (error) => {
        // Cambiado para que el manejo del error sea correcto
        console.log("No se pudieron listar los tipos", error);
      }
    );
  }

  obtenerImagenesPublicitarias(): void {
    this.publicidadService.listarPublicidad().subscribe(
      (response) => {
        this.publicidad = response.data.map((publicidad) => {
          if (publicidad.url_imagen_publicitaria) {
            publicidad.imagen = publicidad.url_imagen_publicitaria;
          }
          return publicidad;
        });
        console.log("Imagenes Publicitarias:", this.publicidad);
      },
      (error) => {
        console.error("Error al obtener las Imagenes", error);
      }
    );
  }

  crearPublicidad(): void {
    if (this.PublicidadForm.invalid) {
      this.PublicidadForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    if (this.archivos.length > 0) {
      formData.append("url_imagen_publicitaria", this.archivos[0]); // Este nombre debe estar en donde se crea la imagen
    }

    Object.keys(this.PublicidadForm.controls).forEach((key) => {
      const controlValue = this.PublicidadForm.get(key)?.value;
      console.log(key, controlValue); // Verifica que no esté siendo undefined
      if (controlValue === undefined || controlValue === "") {
        formData.append(key, null);
      } else {
        formData.append(key, controlValue); // Si el valor es undefined, agregar null
      }
    });
    this.publicidadService.crearPublicidad(formData).subscribe({
      next: () => {
        Swal.fire("Éxito", "Publicidad creada correctamente", "success");
        this.obtenerImagenesPublicitarias();
        this.PublicidadForm.reset();
        this.archivos = [];
        this.previsualizacion = "";
      },
      error: () =>
        Swal.fire("Error", "No se pudo crear la Publicidad", "error"),
    });
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

  eliminarImagenPublicitaria(id_imagen_publicitaria: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar esta Imagen permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicidadService
          .eliminarPublicidad(id_imagen_publicitaria)
          .subscribe(
            () => {
              Swal.fire("¡Éxito!", "Imagen Eliminado exitosamente", "success");
              this.obtenerImagenesPublicitarias();
            },
            () => Swal.fire("¡Error!", "La Imagen no se pudo borrar", "error")
          );
      }
    });
  }
}
