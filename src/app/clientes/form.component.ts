import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo: string = "Crear Cliente";

  private errores: string[];

  //private inputsex:string = "sex";

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }



  cargarCliente(): void {
    this.activatedRoute.params.subscribe(parametro => {
      let id = parametro['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente
        )
      }
    })
  }
  // sin sweetalert
  /*create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(response => this.router.navigate(['/clientes']));
  }*/
  create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(json => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo cliente', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el backend: '+err.status);
        console.error(err.error.errors);
        
        
      }
      );
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe( json => {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Codigo del error desde el backend: '+err.status);
      console.error(err.error.errors);
      
      
    }

    )
  }




}
