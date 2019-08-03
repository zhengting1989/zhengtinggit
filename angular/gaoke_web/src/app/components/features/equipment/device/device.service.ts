import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class DeviceService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.device;

    public constructor(private baseService: BaseService) {

    }

    addDevice(data, callback) {
        return this.baseService.post(this.resourcesKey, {}, data, callback);
    }

    updateDevice(data, callback) {
        return this.baseService.put(this.resourcesKey, {}, data, callback);
    }

    getDeviceType(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'type'}, callback, data);
    }

    getDeviceSoftware(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'software'}, callback, data);
    }

    getDevice(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'page'}, callback, data);
    }

    getDeviceNopage(data, callback) {
        return this.baseService.get(this.resourcesKey, {}, callback, data);
    }

    deleteDevice(data, callback) {
        return this.baseService.delete(this.resourcesKey, {}, data, callback);
    }

    getDeviceAuth(param, queryParam, callback) {
        return this.baseService.get(this.resourcesKey, param, callback, queryParam);
    }

    postDeviceAuth(param, data, callback) {
        return this.baseService.post(this.resourcesKey, param, data, callback);
    }

    deleteDeviceAuth(param, data, callback) {
        return this.baseService.delete(this.resourcesKey, param, data, callback);
    }

    getDeviceAuthPage(param, queryParam, callback) {
        //return this.baseService.get(this.resourcesKey, {param: 'auth/maintain/page'}, callback, queryParam);
        return this.baseService.get(this.resourcesKey, param, callback, queryParam);
    }

    checkSn(param, queryParam, callback) {
        return this.baseService.get(this.resourcesKey, param, callback, queryParam);
    }

    getLog(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: "monitor/history/page"}, callback, queryParam);
    }

    getPeopleAuthPage(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: "auth/user/usage/page"}, callback, queryParam);
    }
    getAllDevice(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'all', action:"page"}, callback, data);
    }
}
