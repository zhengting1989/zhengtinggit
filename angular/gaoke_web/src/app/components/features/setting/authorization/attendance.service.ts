import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class AttendanceService {

    resourcesKey: string = this.baseService.resourcesKeys.org.group;

    public constructor(private baseService: BaseService) {

    }

    getDeviceTree(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'tree/device'}, callback, queryParam);
    }

}
