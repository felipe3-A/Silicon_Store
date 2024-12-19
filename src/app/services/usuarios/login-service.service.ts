import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = environment.apiUrl;
  loginStatusChanged = new EventEmitter<boolean>();

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  postLogin(formValue: any): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.httpClient.post<any>(url, formValue).pipe(
      map((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        localStorage.setItem('userId', response.userId);
        console.log('token:', localStorage);
        return response;
      })
    );
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  cerrarSesion(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No se encontró un token de autenticación en el almacenamiento local.');
    }

    const url = `${this.baseUrl}/cerrarSesion`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post<any>(url, null, { headers }).pipe(
      map((response) => {
        this.removerToken();
        localStorage.removeItem('isLoggedIn');
        return response;
      })
    );
  }

  removerToken() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }
}
