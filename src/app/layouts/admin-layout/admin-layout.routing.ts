import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MainComponent } from 'app/views/main/main.component';
import { AdminProductComponent } from 'app/views/admin-product/admin-product.component';
import { Component } from '@angular/core';
import { CartComponent } from 'app/views/cart/cart.component';
import { OfertsComponent } from 'app/views/oferts/oferts.component';
import { BuyProductComponent } from 'app/views/buy-product/buy-product.component';
import { LoginComponent } from 'app/views/login/login.component';
import { MenuAdminComponent } from 'app/views/menu-admin/menu-admin.component';
import { UserComponent } from 'app/views/user/user.component';
import { MarcasComponent } from 'app/views/marcas/marcas.component';
import { PublicidadComponent } from 'app/views/publicidad/publicidad.component';
import { VerProductosComponent } from 'app/views/ver-productos/ver-productos.component';
import { CategoriasComponent } from 'app/views/categorias/categorias.component';
import { TipoProductoComponent } from 'app/views/tipo-producto/tipo-producto.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }

    { path: '', redirectTo: 'store', pathMatch: 'full' },
    
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    {path: 'store', component: MainComponent },
    {path: 'AdminProduct', component: AdminProductComponent},
    {path: 'cart', component:CartComponent},
    {path:'oferts', component: OfertsComponent},
    {path:'buyProduct', component: BuyProductComponent},
    {path:'main', component: MenuAdminComponent},
    {path:'users', component: UserComponent},
    {path:'marcas', component: MarcasComponent},
    {path:'publicidad', component: PublicidadComponent},
    {path:'products', component: VerProductosComponent},
    {path:'category', component: CategoriasComponent},
    {path: 'tipos', component:TipoProductoComponent}


    // {path:'login', component: LoginComponent},
];
