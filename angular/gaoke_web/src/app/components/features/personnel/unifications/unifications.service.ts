import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';
import {CommonTableService} from '../../../../common/components/dynamicTable/common.table.service';
import {SpinService} from '../../../../common/spin/spin.service';

@Injectable()
export class UnificationsService implements CommonTableService {

    resourcesKey: string = this.baseService.resourcesKeys.org.unification;

    public constructor(private baseService: BaseService,private spinService: SpinService) {

    }

    addData(data, callback) {
        return this.baseService.post(this.resourcesKey, {}, [data], callback);
    }

    getData(queryParam, callback) {
        if (queryParam && queryParam.queryTime) {
            delete queryParam.queryTime;
        }
        let dyComponent = this;
        this.spinService.spin(true);
        return this.baseService.get(this.resourcesKey, {param: 'paging'}, function (result) {
            dyComponent.spinService.spin(false);
            callback.call(callback, result);
        }, queryParam);
    }

    getDataList(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'list'}, callback, queryParam);
    }

    updateData(data, callback) {
        return this.baseService.put(this.resourcesKey, {}, [data], callback);
    }

    deleteData(data, callback) {
        data = data || [];
        let userIds = [];
        data.forEach(function (user) {
            userIds.push(user.unificationId);
        });
        return this.baseService.delete(this.resourcesKey, {}, userIds, callback);
    }

    sortData(data, callback) {
        callback.call(callback, data);
    }

    attributeCheck(data, callback) {
        callback.call(callback, undefined);
    }

}
