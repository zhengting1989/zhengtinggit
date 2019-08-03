import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class ModuleQueryService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.device;

    public constructor(private baseService: BaseService) {

    }

    getDeviceModule(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'module'}, callback, data);
    }

}
