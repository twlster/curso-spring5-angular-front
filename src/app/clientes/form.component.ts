import { Component, OnInit } from '@angular/core';
import {Cliente} from "./cliente";
import {Region} from "./region";
import { ClientService } from './client.service';
import { RegionService } from './region.service';
import {Router, ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente()
  private titulo:string = "Crear Cliente"
  private errors: string[];
  private regions: Region[];

  constructor(private clientService: ClientService, private regionService: RegionService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente()
  }

  public cargarCliente():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.clientService.getCliente(id).subscribe(cliente => this.cliente = cliente);
      }
    });
    this.regionService.getRegions().subscribe(regions => this.regions = regions);
  }

  public create():void {
    this.clientService.create(this.cliente).subscribe(cliente => {
       this.router.navigate(['/clientes'])
          swal.fire('Cliente Guardado', `Cliente ${cliente.name} creado con exito!`, 'success')
     },
     err => {
       this.errors = err.error.errors as string[];
       console.error(err.status + ": " + err.error.errors);
     })
  }

  public update(client: Cliente): void {
    console.log("Clicked!")
    console.log(this.cliente)
    this.clientService.update(this.cliente).subscribe(cliente => {
       this.router.navigate(['/clientes'])
          swal.fire('Cliente Actualizado', `Cliente ${cliente.name} actualizado con exito!`, 'success')
     },
     err => {
       this.errors = err.error.errors as string[];
       console.error(err.status + ": " + err.error.errors);
     })
  }

  compareRegions(o1: Region, o2: Region): boolean{
    if(o1 === undefined && o2 === undefined){
       return true;
     } else {
       return  o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
    }
  }

}
