import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';
import {CommonTableService} from '../../../../common/components/dynamicTable/common.table.service';

@Injectable()
export class LogsService implements CommonTableService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.log;

    public constructor(private baseService: BaseService) {

    }

    addData(data, callback) {
    }

    getData(queryParam, callback) {
        let param = JSON.parse(JSON.stringify(queryParam));
        if (param) {
            param['keyword'] = param.queryKeywords ? param.queryKeywords : '';
            delete param.queryKeywords;
        }
        return this.baseService.get(this.resourcesKey, {param: 'paging'}, callback, param);
    }


    updateData(data, callback) {
    }

    deleteData(data, callback) {
    }

    sortData(data, callback) {
        callback.call(callback, data);
    }

    attributeCheck(data, callback) {
        callback.call(callback, data);
    }
}
