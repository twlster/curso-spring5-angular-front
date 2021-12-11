import {Product} from './product';

export class BillItem {
  product: Product;
  quantity: number = 1;
  value: number;

  public calculateValue(): number{
    return this.product.price*this.quantity;
  }
}
