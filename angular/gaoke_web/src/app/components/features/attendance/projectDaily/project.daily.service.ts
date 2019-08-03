import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class ProjectDailyService {

    resourcesKey: string = this.baseService.resourcesKeys.time.attendee;

    public constructor(private baseService: BaseService) {

    }

}
