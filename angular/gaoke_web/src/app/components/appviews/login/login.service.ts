import {Injectable} from '@angular/core';
import {BaseService} from '../../../common/base.service';

@Injectable()
export class LoginService {

    resourcesKey: any = this.baseService.resourcesKeys.org.user;

    public constructor(private baseService: BaseService) {

    }

    doLogin(payload, callback) {
        return this.baseService.post(this.resourcesKey, {param:'login'}, payload, callback);
    }

    againLogin(payload, callback) {
        return this.baseService.post(this.resourcesKey, {param:'login',action:'again'}, payload, callback);
    }
}
