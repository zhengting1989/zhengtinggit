import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class PropertyService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.device;

    public constructor(private baseService: BaseService) {

    }

    getDeviceType(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'type'}, callback, data);
    }
}
