import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl; // URL base desde el archivo de configuración

  constructor(private http: HttpClient) { }

  // Método para listar los productos
  listarProductos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/imagenes/upload`);  // Asumiendo que la ruta de los productos es /api/products
  }

  crearProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/imagenes/upload`, formData); // Asegúrate de que esta URL sea la correcta
  }
  
  eliminarProducto(id_imagen: number): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/api/imagenes/upload/${id_imagen}`)
  }

  editarProducto(id_imagen: number, ProductoData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/imagenes/upload/${id_imagen}`, ProductoData);
  }

  listarProductosPorCategoria(id_categoria: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/categoriaProducto/${id_categoria}`).pipe(
      map((response) => response.data || []) // Devuelve un arreglo vacío si `data` no existe
    );
  }
  
  

  // En tu servicio de Angular
getProductos() {
  return this.http.get<any[]>('http://localhost:3000/productos'); // Cambia la URL por la correcta
}

  
  
}


