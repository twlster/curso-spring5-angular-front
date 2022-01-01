import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientService } from './client.service';
import {ModalService} from './detalle/modal.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {AuthService} from '../users/auth.service';

import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clients: Cliente[] = [];
  available: boolean = false;
  paginador: any;
  selectedClient: Cliente;

  public urlBackend: string = URL_BACKEND;

  constructor(private clientService: ClientService, private router: Router, private activatedRoute: ActivatedRoute, public modalService: ModalService,
  public authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clientService.getPagedClients(page).subscribe(cli => {
        this.setClientsList(cli.content as Cliente[]);
        this.paginador = cli;
      });
      this.available=true
    });

    this.modalService.pictureUploadNotifier.subscribe(newClient => {
      this.clients = this.clients.map(original => {
        if(original.id == newClient.id){
          original.picture = newClient.picture;
        }
        return original;
      })
    });

  }

  setClientsList(clientList: Cliente[]) {
    this.clients = clientList;
  }

  getAvailable(): boolean {
    return this.available;
  }

  changeAvailable() : void {
    this.available = (this.available == true) ? false : true;
  }

  calculateButtonName() : string {
    return (this.available == true) ? 'Ocultar' : 'Mostrar';
  }

  borrarCliente(cliente: Cliente) {
    swal.fire({
      title: 'Estas seguro?',
      text: `Desea borrar al cliente ${cliente.name} ${cliente.lastName}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText:'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      console.log(result.isConfirmed)
      if (result.isConfirmed) {
        this.clientService.deleteCliente(cliente).subscribe(() => {
           this.clients = this.clients.filter(cli => cli !== cliente)
           swal.fire('Cliente Borrado', `Cliente borrado con exito!`, 'success')
         })
      } else {
         swal.fire('Cliente No Borrado', `Cliente no ha sido borrado!`, 'info')
      }
    })
  }

  openModal(client: Cliente){
    this.selectedClient = client;
    this.modalService.open();
  }

}
