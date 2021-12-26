import { Component, OnInit } from '@angular/core';
import {BillService} from './services/bill.service';
import {Bill} from './models/bill';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-billsdetail',
  templateUrl: './billsdetail.component.html'
})
export class BillsdetailComponent implements OnInit {

  bill: Bill;
  tittle: string = 'Bills';

  constructor(private billService: BillService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      this.billService.getBill(id).subscribe(bill => this.bill = bill)
    });
  }

}
