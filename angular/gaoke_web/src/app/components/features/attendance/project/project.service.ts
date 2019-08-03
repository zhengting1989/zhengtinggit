import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class ProjectService {

    resourcesKey: string = this.baseService.resourcesKeys.time.attendee;

    public constructor(private baseService: BaseService) {

    }

    getAllTable(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'download'}, callback, data);
    }

    getTablePage(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'page'}, callback, data);
    }

    getAttendee(data, callback) {
        return this.baseService.get(this.resourcesKey, {}, callback, data);
    }

    getAttendeeAll(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'download/detail'}, callback, data);
    }
}
