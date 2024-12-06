import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productosRecomendados = [
    {
      nombre: 'Producto 1',
      descripcion: 'Descripción breve del producto 1',
      precio: 29.99,
      imagen: 'https://via.placeholder.com/150'
    },
    {
      nombre: 'Producto 2',
      descripcion: 'Descripción breve del producto 2',
      precio: 39.99,
      imagen: 'https://via.placeholder.com/150'
    },
    {
      nombre: 'Producto 3',
      descripcion: 'Descripción breve del producto 3',
      precio: 49.99,
      imagen: 'https://via.placeholder.com/150'
    },
    {
      nombre: 'Producto 4',
      descripcion: 'Descripción breve del producto 4',
      precio: 59.99,
      imagen: 'https://via.placeholder.com/150'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
