import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../common/base.service';
import {CommonTableService} from '../../../../../common/components/dynamicTable/common.table.service';

@Injectable()
export class CrossDomainService implements CommonTableService {

    resourcesKey: string = this.baseService.resourcesKeys.org.groupUser;

    public constructor(private baseService: BaseService) {

    }

    addData(data, callback) {
        callback.call(callback, {});
    }

    getData(queryParam, callback) {
        if (queryParam && (queryParam.groupId || queryParam.groupId == 0)) {
            if (queryParam.queryDate) {
                delete queryParam.queryDate;
            }
            return this.baseService.get(this.resourcesKey, {param: 'crossDomain', action: 'paging'}, callback, queryParam);
        } else {
            callback.call(callback, {});
        }
    }

    updateData(data, callback) {
        callback.call(callback, {});
    }

    deleteData(data, callback) {
        callback.call(callback, {});
    }

    sortData(data, callback) {
        callback.call(callback, {});
    }

    attributeCheck(data, callback) {
        callback.call(callback, {});
    }

    addUserToGroup(payload, callback) {
        return this.baseService.post(this.resourcesKey, {}, payload, callback);
    }
}

