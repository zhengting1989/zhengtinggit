import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class propertyDailyService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.device;

    public constructor(private baseService: BaseService) {

    }

}
