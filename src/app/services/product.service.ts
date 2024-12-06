import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }

  // Método para listar los productos
  listarProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/productos`);  // Asumiendo que la ruta de los productos es /api/products
  }

  crearProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/productos`, formData);
  }
  
  
}


