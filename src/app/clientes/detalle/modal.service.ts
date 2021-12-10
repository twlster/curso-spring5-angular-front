import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  modal: boolean;
  private _pictureUploadNotifier = new EventEmitter<any>();

  get pictureUploadNotifier(): EventEmitter<any> {
    return this._pictureUploadNotifier;
  }

  open(){
    this.modal = true;
  }

  close(){
    this.modal=false;
  }

}
