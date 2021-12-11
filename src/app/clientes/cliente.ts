import {Region} from './region';
import {Bill} from '../bills/models/bill';

export class Cliente {

    id: number;
    name: string;
    lastName: string;
    email: string;
    birthDate: string;
    picture: string;
    region: Region;
    bills: Array<Bill> = [];
}
