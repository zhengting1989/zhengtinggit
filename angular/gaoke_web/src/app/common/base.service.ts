import {Injectable} from '@angular/core';
import {RestOption, RestService} from './rest.service';
import {ResourceService} from './resource.service';
import {HttpHeaders} from '@angular/common/http';
import {NativeToastrService} from './native.toastr.service';
import {SpinService} from './spin/spin.service';

export interface BaseOption {
    httpHeader?: HttpHeaders;
    restHttpParams?: Object;
    openSpin?: boolean;
    showToastr?: boolean;
    toastrTitle?: string;
    toastrMessage?: string;
    toastrType?: string;
    responseType?: any;
}

/**
 * 严格要求格式(必不可少的四项传值)
 * resourceKey: string, 对应ResourceService中resources的属性名称（不可错）
 * param: any,  对应ResourceService中resources的属性值需要替换部分<若无请用 {}  代替>，如action，id
 * queryParam: any, 对应拼接url后面的queryString，设置到options.para中
 * payload: any,  RestService请求中的body部分<若无请用 {}  代替>
 * callback:function 回调
 */
@Injectable()
export class BaseService {

    resourcesKeys: any = this.resourceService.getResourceKeys();

    constructor(private restService: RestService,
                private resourceService: ResourceService,
                private nativeToastrService: NativeToastrService,
                private spinService: SpinService) {
    }

    get(resourceKey: string, param: any, callback, queryParam?: any, option?: BaseOption) {
        let thisInjectable = this;
        this.resourceService.getResource(resourceKey, param, function (httpUrl) {
            if (httpUrl) {
                option = option ? option : {};
                option.restHttpParams = queryParam;
                let restOption = thisInjectable.structureRestOption(httpUrl, {}, option);
                if (option && option.openSpin) {
                    thisInjectable.spinService.spin(true);
                }
                return thisInjectable.restService.get(restOption).subscribe(result => {
                    callback && callback.call(callback, result);
                    thisInjectable.callbackTreatOption(option);
                });
            } else {
                thisInjectable.nativeToastrService.showWarning('rest', 'not find httpUrl');
            }
        });
    }

    post(resourceKey: string, param: any, payload: any, callback, option?: BaseOption) {
        let thisInjectable = this;
        this.resourceService.getResource(resourceKey, param, function (httpUrl) {
            if (httpUrl) {
                let restOption = thisInjectable.structureRestOption(httpUrl, payload, option);
                if (option && option.openSpin) {
                    thisInjectable.spinService.spin(true);
                }
                return thisInjectable.restService.post(restOption).subscribe(result => {
                    callback && callback.call(callback, result);
                    thisInjectable.callbackTreatOption(option);
                });
            } else {
                thisInjectable.nativeToastrService.showWarning('rest', 'not find httpUrl');
            }
        });
    }

    put(resourceKey: string, param: any, payload: any, callback, option?: BaseOption) {
        let thisInjectable = this;
        this.resourceService.getResource(resourceKey, param, function (httpUrl) {
            if (httpUrl) {
                let restOption = thisInjectable.structureRestOption(httpUrl, payload, option);
                if (option && option.openSpin) {
                    thisInjectable.spinService.spin(true);
                }
                return thisInjectable.restService.put(restOption).subscribe(result => {
                    callback && callback.call(callback, result);
                    thisInjectable.callbackTreatOption(option);
                });
            } else {
                thisInjectable.nativeToastrService.showWarning('rest', 'not find httpUrl');
            }
        });
    }

    delete(resourceKey: string, param: any, payload: any, callback, option?: BaseOption) {
        let thisInjectable = this;
        this.resourceService.getResource(resourceKey, param, function (httpUrl) {
            if (httpUrl) {
                let restOption = thisInjectable.structureRestOption(httpUrl, payload, option);
                if (option && option.openSpin) {
                    thisInjectable.spinService.spin(true);
                }
                return thisInjectable.restService.delete(restOption).subscribe(result => {
                    callback && callback.call(callback, result);
                    thisInjectable.callbackTreatOption(option);
                });
            } else {
                thisInjectable.nativeToastrService.showWarning('rest', 'not find httpUrl');
            }
        });
    }

    private structureRestOption(httpUrl: string, body?: any, option?: BaseOption): RestOption {
        let restOption: RestOption = {
            restUrl: httpUrl,
            httpHeader: option ? option.httpHeader : undefined,
            restBody: body,
            restHttpParams: option ? option.restHttpParams : undefined,
            responseType: option ? option.responseType : 'json'
        };
        return restOption;
    }

    private callbackTreatOption(option: BaseOption) {
        if (option && option.showToastr) {
            this.nativeToastrService.showSuccess();
        }
    }

}
