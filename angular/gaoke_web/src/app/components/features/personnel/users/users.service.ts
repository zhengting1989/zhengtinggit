import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';
import {CommonTableService} from '../../../../common/components/dynamicTable/common.table.service';
import * as shajs from 'sha.js';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class UsersService implements CommonTableService {

    resourcesKey: string = this.baseService.resourcesKeys.org.user;

    public constructor(private baseService: BaseService) {

    }

    addData(data, callback) {
        if (data.password) {
            data['password'] = shajs('sha256').update(data.password).digest('hex');
        }
        return this.baseService.post(this.resourcesKey, {}, [data], callback);
    }

    getData(data, callback) {
        if (data && (data.groupId || data.groupId == '0' || data.groupId == 0)) {
            if (data.queryTime) {
                delete data.queryTime;
            }
            return this.baseService.get(this.resourcesKey, {param: 'paging'}, callback, data);

        }
    }

    updateData(data, callback) {
        if (data.password) {
            data['password'] = shajs('sha256').update(data.password).digest('hex');
        }
        return this.baseService.put(this.resourcesKey, {}, [data], callback);
    }

    uploadFiles(data, callback) {
        let headerHttp = new HttpHeaders();
        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        return this.baseService.post(this.resourcesKey, {param: 'upload'}, data, callback, {httpHeader: headerHttp});
    }


    deleteData(data, callback) {
        data = data || [];
        let userIds = [];
        data.forEach(function (user) {
            userIds.push(user.userId);
        });
        return this.baseService.delete(this.resourcesKey, {}, userIds, callback);
    }

    sortData(data, callback) {
        callback.call(callback, data);
    }

    attributeCheck(data, callback) {
        callback.call(callback, data);
    }

    checkUserLogin(payload, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'existField'}, callback, payload);
    }

    getSelf(callback) {
        return this.baseService.get(this.resourcesKey, {param: 'self'}, callback);
    }

    getUsersByIds(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'batch'}, callback, queryParam);
    }

    resetPassword(payload, callback) {
        let shaPayload = {
            oldPassword: shajs('sha256').update(payload.oldPassword).digest('hex'),
            newPassword: shajs('sha256').update(payload.newPassword).digest('hex')
        };
        return this.baseService.put(this.resourcesKey, {param: 'resetPwd'}, shaPayload, callback);
    }
}
