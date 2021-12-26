import {BillItem} from './bill.item';
import {Cliente} from '../../clientes/cliente';

export class Bill {

      id: number;
      description: string;
      observation: string;
      items: Array<BillItem> = [];
      client: Cliente;
      total: number;
      createdAt: string;

      public calculateTotal(): number{
        return this.items.reduce((sum, current) => sum + current.calculateValue(), 0);
      }
}
