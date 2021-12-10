import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {

  available: boolean = true;
  opciones: string[] = ['C', 'Java', 'C#'];

  constructor() { }

  getAvailable(): boolean {
    return this.available;
  }

  changeAvailable() : void {
    this.available = (this.available == true) ? false : true;
  }

  calculateButtonName() : string {
    return (this.available == true) ? 'Hide' : 'Show';
  }

}
