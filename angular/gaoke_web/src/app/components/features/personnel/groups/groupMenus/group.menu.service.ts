import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../common/base.service';

@Injectable()
export class GroupMenuService {

    resourcesKey: string = this.baseService.resourcesKeys.org.groupMenu;

    public constructor(private baseService: BaseService) {

    }

    getGroupMenus(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {}, callback, queryParam);
    }

    saveGroupMenus(payload, callback) {
        return this.baseService.post(this.resourcesKey, {}, payload, callback);
    }

}

