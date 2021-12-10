import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {Cliente} from '../cliente';
import {ClientService} from '../client.service';
import {ModalService} from './modal.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {AuthService} from '../../users/auth.service';


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit{

  @Input() cliente: Cliente;
  titulo: string = "Clients Details";
  private selectedPicture: File;
  progress: number = 0;

  @ViewChild("fileElement", {static: false})
  fileElement: ElementRef;

  ngOnInit(){

  }

  constructor(private clientService: ClientService,
    private router: Router,  private modalService: ModalService,
    private authService: AuthService) { }

  selectPicture(event) {
    this.progress = 0;
    if(event.target.files[0] && event.target.files[0].type.indexOf('image') < 0){
      swal.fire('Error', 'Debe seleccionar un archivo del tipo imagen', 'error');
      this.selectedPicture = null;
      this.fileElement.nativeElement.value = "";
    } else {
      this.selectedPicture = event.target.files[0];
    }
  }

  uploadPicture(){
    if(!this.selectedPicture){
      swal.fire('Error', 'Debe seleccionar una imagen', 'error');
    } else {
      this.clientService.uploadPicture(this.selectedPicture, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.client as Cliente;

          this.modalService.pictureUploadNotifier.emit(this.cliente);

          swal.fire('Imagen del Cliente Guardado', `La imagen ${this.cliente.picture} del cliente ${this.cliente.name} se ha guardado con exito!`, 'success')
        }
      })
    }
  }

  closeModal(){
    this.modalService.close();
    this.selectPicture = null;
    this.progress = 0;
  }

}
