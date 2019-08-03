import {Injectable} from '@angular/core';
import {BaseService} from '../../../common/base.service';

@Injectable()
export class DashboardTimeService {

    resourcesKey: any = this.baseService.resourcesKeys.time.dashboard;
    resourcesKeyGroup: string = this.baseService.resourcesKeys.org.groupUser;

    public constructor(private baseService: BaseService) {

    }

    callData(payload, callback) {
        return this.baseService.get(this.resourcesKey, payload, callback);
    }

    getUserClickData(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'users'}, callback, queryParam);
    }

    getUserSum(payload, callback) {
        return this.baseService.get(this.resourcesKeyGroup, {param: 'count'}, callback, payload);
    }
}
