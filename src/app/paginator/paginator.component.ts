import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;
  paginas: number[];
  start: number;
  end: number;

  constructor() { }

  ngOnInit() {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges) {
    let paginadorActualizado = changes['paginador'];
    if(paginadorActualizado.previousValue){
      this.initPaginator();
    }
  }

  private initPaginator(): void{
    this.start = Math.min( Math.max(1, this.paginador.number-2), this.paginador.totalPages-3);
    this.end = Math.max( Math.min(this.paginador.totalPages, this.paginador.number+1),4);

    if(this.paginador.totalPages>3){
      this.paginas = new Array(this.end-this.start+1).fill(0).map((_value, index) => index+this.start);
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_value, index) => index+1);
    }
  }

}
