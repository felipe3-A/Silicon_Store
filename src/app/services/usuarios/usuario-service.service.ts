import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http:HttpClient) { }
  obtenerUsuarios(): Observable<any>{
    return this.http.get(`${this.baseUrl}/usuarios`);  // Asumiendo que la ruta de los productos es /api/products
  }

  crearUsuario(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, data);
  }
  

  editarUsuario(id: number, ProductoData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/${id}`, ProductoData);
  }

  eliminarUsuario(id: number): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/usuarios/${id}`)
  }

  login(usuario: string, contrasena: string): Observable<any> {
    const loginData = { email: usuario, identificacion: contrasena }; // Ajusta según el backend

    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

}
