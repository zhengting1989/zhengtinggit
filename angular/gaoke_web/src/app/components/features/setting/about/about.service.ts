import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';
import {AttributeMark, CommonTableService} from '../../../../common/components/dynamicTable/common.table.service';

@Injectable()
export class AboutService implements CommonTableService {

    resourcesKey: string = this.baseService.resourcesKeys.org.about;

    public constructor(private baseService: BaseService) {

    }

    addData(data, callback) {
        delete data.checked;
        return this.baseService.post(this.resourcesKey, {}, [data], callback);
    }

    getData(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'paging'}, callback, queryParam);
    }

    getListData(callback) {
        return this.baseService.get(this.resourcesKey, {}, callback);
    }

    updateData(data, callback) {
        delete data.checked;
        return this.baseService.put(this.resourcesKey, {}, [data], callback);
    }

    deleteData(data, callback) {
        let params = data || [];
        let keys = [];
        params.forEach(function (param) {
            keys.push(param.key);
        });
        return this.baseService.delete(this.resourcesKey, {}, keys, callback);

    }

    sortData(data, callback) {
        callback.call(callback, data);
    }

    attributeCheck(data, callback) {
        if (data.isUpdateFromAttribute) {
            callback.call(callback, undefined);
        } else {
            this.checkKeyField({keyField: data.key},
                function (result) {
                    if (result) {
                        let attributeMark: AttributeMark = {
                            isValid: false,
                            validKey: 'key',
                            validLabel: '属性key值已存在,请更换属性key值'
                        };
                        callback.call(callback, attributeMark);
                    } else {
                        callback.call(callback, undefined);
                    }
                });

        }
    }

    checkKeyField(payload, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'existField'}, callback, payload);
    }
}
