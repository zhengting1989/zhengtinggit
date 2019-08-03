import {Injectable} from '@angular/core';
import {BaseService} from '../../../common/base.service';

@Injectable()
export class DashboardDeviceService {

    resourcesKey: any = this.baseService.resourcesKeys.iot.dashboard;

    public constructor(private baseService: BaseService) {

    }

    callData(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {}, callback, this.checkQueryParam(queryParam));
    }

    getDeviceDetailsData(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'devices'}, callback, this.checkQueryParam(queryParam));
    }

    checkQueryParam(queryParam): any {
        if (queryParam && queryParam.duration) {
            let periodHour = Number(queryParam.duration.replace('h', ''));
            queryParam.duration = periodHour;
            if (periodHour <= 0) {
                delete queryParam.duration;
            }
        }
        return queryParam;
    }

}
