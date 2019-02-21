import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import  localeES  from '@angular/common/locales/es';
import { Cliente } from './cliente';
//import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  /* Esto hasta antes de hacer paginación
  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    //return  this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe (
      map( response => {
        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          

          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); //con formateDate
          
          //con DatePipe
          let datePipe = new DatePipe('es'); //por defecto trae en-US
          //cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy'); //formato normal
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); //formato con nombres
          return cliente;
        });
      }
      )
    );
  }*/

  // usando el tap y llamando a list sin paginacion
  /*getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint).pipe (
      tap(response => {
        let clientes = response as Cliente[];
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map( response => {
        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es'); //por defecto trae en-US
          return cliente;
        });
      }),
      tap(response => {
        response.forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }*/

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe (
      tap((response : any) => {
        
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es'); //por defecto trae en-US
          return cliente;
        });
        return response;
      }),
      tap(response => {
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  create(cliente: Cliente) : Observable<any> {
    return this.http.
    post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders})
    .pipe(  //aqui empieza la validacion
      catchError(e => {
        //inicio validacion con servidor
        if(e.status==400) {
          return throwError(e);
        }
        //fin valid. con sv
        swal.fire(e.error.mensaje,e.error.error , 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
    .pipe( //aqui empieza la validacion
      catchError(e => {
        this.router.navigate(['/clientes']);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http
    .put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders})
    .pipe( //aqui empieza la validacion
      catchError(e => {
        //this.router.navigate(['/clientes']);
        //inicio validacion con servidor
        if(e.status==400) {
          return throwError(e);
        }
        //fin valid. con sv

        swal.fire('Error al editar el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http
    .delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
    .pipe( //aqui empieza la validacion
      catchError(e => {
        this.router.navigate(['/clientes']);
        swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<Cliente>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id",id);
    return this.http.post(`${this.urlEndPoint}/upload`, formData)
    .pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+ '/regiones');
  }
}
