import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../common/base.service';
import {CommonTableService} from '../../../../../common/components/dynamicTable/common.table.service';

@Injectable()
export class GroupUserService implements CommonTableService {

    resourcesKey: string = this.baseService.resourcesKeys.org.groupUser;

    public constructor(private baseService: BaseService) {

    }

    addData(data, callback) {
    }

    getData(queryParam, callback) {
        if (queryParam && (queryParam.groupId || queryParam.groupId == 0)) {
            if (queryParam.groupUserKeywords) {
                queryParam['keyword'] = queryParam.groupUserKeywords;
                delete queryParam.groupUserKeywords;
            }
            if (queryParam.queryDate) {
                delete queryParam.queryDate;
            }
            return this.baseService.get(this.resourcesKey, {}, callback, queryParam);
        } else {
            callback.call(callback, {});
        }
    }

    updateData(data, callback) {
    }

    deleteData(data, callback) {
    }

    sortData(data, callback) {
    }

    attributeCheck(data, callback) {

    }

    addUserToGroup(payload, callback) {
        return this.baseService.post(this.resourcesKey, {}, payload, callback);
    }

    deleteUserFromGroup(payload, callback) {
        return this.baseService.delete(this.resourcesKey, {}, payload, callback);
    }
}

