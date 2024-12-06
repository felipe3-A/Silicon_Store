import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MainComponent } from './views/main/main.component';
import { CartComponent } from './views/cart/cart.component';
import { AdminProductComponent } from './views/admin-product/admin-product.component';
import { OfertsComponent } from './views/oferts/oferts.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    MainComponent,
    CartComponent,
    AdminProductComponent,
    OfertsComponent,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
