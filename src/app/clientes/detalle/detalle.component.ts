import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  
  @Input() cliente: Cliente;
  private fotoSeleccionada: File;

  constructor(private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit() {
    /*this.activateRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        })
      }
    });*/

  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    console.log("foto seleccionada: ");
    console.log(this.fotoSeleccionada);

    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error de archivo','debe seleccionar un archivo de tipo imagen','error');
      this.fotoSeleccionada = null;
    }

  }

  subirFoto() {
    //console.log("holi");
    if (!this.fotoSeleccionada) {
      swal.fire('Error Upload','debe seleccionar una imagen','error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(
          cliente => {
            this.cliente = cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire('La foto se ha subido completamente!', `La foto se ha subido con éxito: ${this.cliente.foto}`, 'success');
          }
        );
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
  }

}
