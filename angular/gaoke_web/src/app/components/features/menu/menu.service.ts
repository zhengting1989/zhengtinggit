import {Injectable} from '@angular/core';
import {BaseService} from '../../../common/base.service';


@Injectable()
export class MenuService {

    resource: string = this.baseService.resourcesKeys.org.menu;

    constructor(private baseService: BaseService,) {
    }

    getLeftMenus(callback) {
        return this.baseService.get(this.resource, {}, callback);
    }


}
