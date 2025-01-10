import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MainComponent } from './views/main/main.component';
import { CartComponent } from './views/cart/cart.component';
import { AdminProductComponent } from './views/admin-product/admin-product.component';
import { OfertsComponent } from './views/oferts/oferts.component';
import { EditProductComponent } from './modal/edit-product/edit-product.component';
import { SeeProductComponent } from './modal/see-product/see-product.component';
import { BuyProductComponent } from './views/buy-product/buy-product.component';
import { ReservesComponent } from './views/reserves/reserves.component';
import { LoginComponent } from './views/login/login.component';
import { MenuAdminComponent } from './views/menu-admin/menu-admin.component';
import { EditUserComponent } from './modal/edit-user/edit-user.component';
import { SeeUserComponent } from './modal/see-user/see-user.component';
import { UserComponent } from './views/user/user.component';
import { EmptyLayoutComponent } from './layouts/empty-layout/empty-layout.component';
import { LoginService } from './services/usuarios/login-service.service';
import { JwtModule } from '@auth0/angular-jwt';
import { MarcasComponent } from './views/marcas/marcas.component';
import { CategoriasComponent } from './views/categorias/categorias.component';
import { PublicidadComponent } from './views/publicidad/publicidad.component';
import { VerProductosComponent } from './views/ver-productos/ver-productos.component';
import { TipoProductoComponent } from './views/tipo-producto/tipo-producto.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['silicon.com'], // Cambia esto por tu dominio
        disallowedRoutes: ['http://localhost:3000/login'], // Opcional
      },
    }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    NgxPaginationModule,
    AppRoutingModule,
    
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    MainComponent,
    CartComponent,
    BuyProductComponent,
    SeeUserComponent,
    EditUserComponent,
    AdminProductComponent,
    OfertsComponent,
    EditProductComponent,
    SeeProductComponent,
    ReservesComponent,
    LoginComponent,
    MenuAdminComponent,
    EditUserComponent,
    SeeUserComponent,
    UserComponent,
    EmptyLayoutComponent,
    MarcasComponent,
    CategoriasComponent,
    PublicidadComponent,
    VerProductosComponent,
    TipoProductoComponent,
    

  ],
  providers: [LoginService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true, // Esto indica que puedes tener múltiples interceptores
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
