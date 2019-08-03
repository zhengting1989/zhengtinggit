import {Injectable} from '@angular/core';
import {Constants} from './constants';

@Injectable()
export class ResourceService {

    private resources = {
        org: {
            example: 'example/:param/:action',
            menu: 'menu/:param/:action',
            user: 'user/:param/:action',
            group: 'group/:param/:action',
            unification: 'unification/:param/:action',
            groupUser: 'groupUser/:param/:action',
            groupMenu: 'groupMenu/:param/:action',
            about: 'about/:param/:action'
        },
        iot: {
            example: 'example/:param/:action',
            device: 'device/:param/:action',
            download: ':param/:action',
            log: 'log/:param/:action',
            dashboard: 'dashboard/:param/:action',
            software: 'device/software/:param/:action'
        },
        time:{
            attendee: 'attendee/:param/:action',
            dashboard: 'dashboard/:param/:action'
        },
        example: 'example/:param/:action',
        test: 'user/:param/:action'
    };

    private base = {
        org: 'hilevepsorg/',
        iot: 'hilevepsiot/',
        time: 'hilevepstime/',
        commonBase: 'hilevepsorg/'
    };

    _getUrl(resourceKey: any, parameter: any, type: any, url: any): string {
        if (resourceKey && (this.resources[type] || this.resources[type][url])) {
            let proxy = '';
            let parts;
            if (url) {
                parts = this.resources[type][url].split('/');
            } else {
                parts = this.resources[type].split('/');
            }
            let finalParts = [];
            parts.forEach(function (part) {
                if (part.indexOf(':') > -1 || part.indexOf(location.host) > -1) {
                    let partKey = part.substr(part.indexOf(':') + 1, part.length);
                    if (parameter instanceof Object && parameter[partKey]) {
                        finalParts.push(parameter[partKey]);
                    }
                } else {
                    finalParts.push(part);
                }
            });
            return proxy + finalParts.join('/');
        } else {
            return undefined;
        }
    };

    getResource(resourceKey: any, parameter: any, callback: any) {
        let type = resourceKey.split('.')[0];
        let url = resourceKey.split('.')[1];
        let httpUrl = this._getProxy(type) + this._getUrl(resourceKey, parameter, type, url);
        callback && callback.call(callback, httpUrl);
    };

    _getProxy(type: any) {
        let baseType = this.base[type] ? this.base[type] : this.base['commonBase'];
        let url_prefix = Constants.URL_PREFIX ? Constants.URL_PREFIX + '/' : '';
        let webapp_version = Constants.WEBAPP_VERSION ? Constants.WEBAPP_VERSION + '/' : '';
        return baseType + url_prefix + webapp_version;
    }

    getResourceKeys(): any {
        let resourceKeys: any = JSON.parse(JSON.stringify(this.resources));
        for (let resourceKey in this.resources) {
            if (this.resources.hasOwnProperty(resourceKey)) {
                if (typeof(this.resources[resourceKey]) == 'string') {
                    resourceKeys[resourceKey] = resourceKey;
                } else {
                    for (let Key in this.resources[resourceKey]) {
                        resourceKeys[resourceKey][Key] = resourceKey + '.' + Key;
                    }
                }
            }
        }
        return resourceKeys;
    }
}
