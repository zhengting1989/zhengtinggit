import {Injectable} from '@angular/core';


export interface AttributeMark {
    isValid: boolean;
    validKey: string;
    validLabel: string;
}

@Injectable()
export abstract class CommonTableService {
    abstract addData(data, callback);

    abstract getData(data, callback);

    abstract updateData(data, callback);

    abstract deleteData(data, callback);

    abstract sortData(data, callback);

    abstract attributeCheck(data, callback);

}
