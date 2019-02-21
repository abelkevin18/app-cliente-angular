import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators'
import swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: []
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService) { }

  // 1 ngOnInit() {
    //this.clientes = this.clienteService.getClientes(); sin Observable
  // 2  this.clienteService.getClientes().subscribe(
      //esto es la funcion normal
      /*function (clientes) {
        this.clientes = clientes
      }*/
      //con funcion anonima o flecha
      /*(clientes) => {
        this.clientes = clientes
      }*/
      // si es solo un argumento ya no se coloca parentesis, y si no hay mas de 1 linea de operacion se obvia las llaves
  // 3    clientes => this.clientes = clientes
  // 4  );

  //5 }


  // con tap y con paginacion manual
  /*ngOnInit() {
    let page = 0;
    this.clienteService.getClientes(page)
    .pipe(
      tap() //(clientes => this.clientes = clientes)
    )
    .subscribe(response => this.clientes = response.content as Cliente[]);// el subscribe sirve para q se ejecute el observable
  }*/

  //paginacion completa
  ngOnInit() {
    
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page)
      .pipe(
       tap()
       )
      .subscribe(response => 
        {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });
    // el subscribe sirve para q se ejecute el observable

    this.modalService.notificarUpload
    .subscribe(
      cliente => {
        this.clientes = this.clientes.map(clienteOriginal => {
          if(cliente.id == clienteOriginal.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        })
      } 
    );

  }
    

  delete(cliente: Cliente): void {
    swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {
            //this.clientes = this.clientes.filter(cli => cli !== cliente) antes de la paginacion
            this.clienteService.getClientes(0).subscribe(response => {
              this.clientes = response.content as Cliente[];
              this.paginador = response;
            });
            swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
