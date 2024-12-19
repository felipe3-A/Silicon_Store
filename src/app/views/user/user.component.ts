import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsuarioService } from "app/services/usuarios/usuario-service.service";

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  usuarios = [];
  usuarioForm: FormGroup;
  usuarioSeleccionado: any = {};

  UsuarioData: any = {
    nombre: null,
    email: null,
    identificacion: null,
    direccion: null,
    telefono: null,
    pago: null,
  };

  @ViewChild("modalContent") modalContent: ElementRef<any> | null = null;

  verModalS: boolean = false;
  verModalE: boolean = false;

  MostarEditarUser: boolean = false;
  MostrarVerUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();

  }

  listarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(
      (response) => {
        console.log("Respuesta del servicio para usuarios:", response);
        this.usuarios = response.data[0] || []; // Asegúrate de acceder a 'data'
      },
      (error) => {
        console.log("Error al listar los Usuarios", error);
      }
    );
  }

  closeModalUser(): void {
    this.verModalE = false;
    this.verModalS = false; // Corrige esta línea
  }

  AbrirModalVerUser(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.verModalS = true; // Abre el modal de ver usuario
    this.verModalE = false; // Cierra el modal de editar usuario
  }

  AbrirModalEditarUser(usuario: any): void {
    this.UsuarioData = { ...usuario }; // Copia los datos del usuario
    this.verModalE = true; // Abre el modal de editar usuario
    this.verModalS = false; // Cierra el modal de ver usuario
  }

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: "¿Seguro que quieres borrar este usuario permanentemente?",
      text: "No se puede volver a recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe(
          () => {
            Swal.fire("¡Éxito!", "Usuario Eliminado exitosamente", "success");
            this.listarUsuarios(); // Actualizamos la lista de usuarios
          },
          (error) => {
            Swal.fire("¡Error!", "El usuario no se pudo borrar", "error");
          }
        );
      }
    });
  }

}
