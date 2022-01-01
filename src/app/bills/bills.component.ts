import { Component, OnInit } from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {Bill} from './models/bill';
import {BillItem} from './models/bill.item';
import {Product} from './models/product';
import {BillService} from './services/bill.service';
import {Cliente} from '../clientes/cliente';
import {ClientService} from '../clientes/client.service';
import {Router, ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html'
})
export class BillsComponent implements OnInit {

  title: string = "New Bill";
  bill: Bill = new Bill();
  public errors: string[];

  productAutoComplete = new FormControl();
  products: Product[];
  filteredProducts: Observable<Product[]>;

  constructor(private clientService: ClientService, private router: Router, private activatedRoute: ActivatedRoute,
  private billService: BillService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('clientId');
      this.clientService.getCliente(id).subscribe(client => this.bill.client = client);
    });
    this.billService.getProducts().subscribe(regions => this.products = regions);
    this.filteredProducts = this.productAutoComplete.valueChanges.pipe(
     startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filter(name) : [])),
   );

  }

  private _filter(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  public displayName(product?: Product): string | undefined {
    return product ? product.name : undefined;
  }

  public selectedProduct(event: MatAutocompleteSelectedEvent): void{
    let product = event.option.value as Product;
    let productNotFound = true;

    this.bill.items = this.bill.items.map((item:BillItem) =>{
      if(product.id === item.product.id){
        ++item.quantity;
        productNotFound = false;
      }
      return item;
    });

    if(productNotFound){
      let newItem = new BillItem();
      newItem.product = product;
      this.bill.items.push(newItem);
    }

    this.productAutoComplete.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  public updateQuantity(productId: number, event: any): void{
    let newQuantity = event.target.value as number;

    if(newQuantity == 0){
      this.deleteProduct(productId);
    }else{
      this.bill.items = this.bill.items.map((item:BillItem) =>{
        if(productId === item.product.id){
          item.quantity = newQuantity;
        }
        return item;
      });
    }
  }

  public deleteProduct(id: number): void{
    this.bill.items = this.bill.items.filter((item: BillItem) => id !== item.product.id);
  }

  public create(billForm):void {

    if(this.bill.items.length == 0){
      this.productAutoComplete.setErrors({'invalid':true});
    }

    if(billForm.form.valid && this.bill.items.length > 0){
      this.billService.create(this.bill).subscribe(bill => {
         this.router.navigate(['/bills', bill.id]);
         swal.fire('Bill Created', `Bill ${bill.description} was successfily created!`, 'success');
       },
       err => {
         this.errors = err.error.errors as string[];
         console.error(this.errors);
         console.error(err.status + ": " + err.error.errors);
       })
     }
  }

  public update(bill: Bill): void {
    this.billService.update(this.bill).subscribe(bill => {
       this.router.navigate(['/bills', bill.id]);
       swal.fire('Bill Updated', `Bill ${this.bill.description} was successfily updated!`, 'success');
     },
     err => {
       this.errors = err.error.errors as string[];
       console.error(err.status + ": " + err.error.errors);
     })
  }


}
