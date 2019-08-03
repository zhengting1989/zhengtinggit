import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class SoftwareService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.software;

    public constructor(private baseService: BaseService) {

    }

    addData(data, callback) {
        return this.baseService.post(this.resourcesKey, {}, [data], callback);
    }

    getData(queryParam, callback) {
        let param = JSON.parse(JSON.stringify(queryParam));
        return this.baseService.get(this.resourcesKey, {}, callback, param);
    }

    updateData(data, callback) {
        return this.baseService.put(this.resourcesKey, {}, [data], callback);
    }
}
