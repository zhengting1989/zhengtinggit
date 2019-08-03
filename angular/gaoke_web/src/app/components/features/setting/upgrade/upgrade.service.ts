import {Injectable} from '@angular/core';
import {BaseOption, BaseService} from '../../../../common/base.service';
import {HttpHeaders} from '@angular/common/http';
import {Constants} from '../../../../common/constants';

@Injectable()
export class UpgradeService {

    resourcesKey: string = this.baseService.resourcesKeys.iot.device;
    resourcesKeyDown: string = this.baseService.resourcesKeys.iot.download;

    public constructor(private baseService: BaseService) {

    }

    getDeviceUpgrade(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'software', action: 'upgrade'}, callback, data);
    }

    download(param, data, callback) {
        let headerHttp = new HttpHeaders();
        headerHttp = headerHttp.append('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem(Constants.AUTH_KEY)));
        headerHttp = headerHttp.append('Content-Type', 'application/zip');
        headerHttp = headerHttp.append('Accept', 'application/zip');
        let baseOption: BaseOption = {
            httpHeader: headerHttp,
            responseType: "arraybuffer"
        };
        return this.baseService.get(this.resourcesKeyDown, param, callback, data, baseOption);
    }

    postDeviceAuth(data, callback) {
        return this.baseService.post(this.resourcesKey, {param: 'software', action: 'upgrade'}, data, callback);
    }

    putDeviceAuth(data, callback) {
        return this.baseService.put(this.resourcesKey, {param: 'software', action: 'upgrade'}, data, callback);
    }

    deleteDeviceAuth(data, callback) {
        return this.baseService.delete(this.resourcesKey, {param: 'software', action: 'upgrade'}, data, callback);
    }

    getDeviceSoftwareList(data, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'software'}, callback, data);
    }

    postDeviceFile(data, callback) {
        let headerHttp = new HttpHeaders();
        //headerHttp = headerHttp.append('Content-Type', 'multipart/form-data');
        headerHttp = headerHttp.append('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem(Constants.AUTH_KEY)));
        let baseOption: BaseOption = {
            httpHeader: headerHttp
        };
        return this.baseService.post(this.resourcesKey, {
            param: 'software',
            action: "upload"
        }, data, callback, baseOption);
    }
}
