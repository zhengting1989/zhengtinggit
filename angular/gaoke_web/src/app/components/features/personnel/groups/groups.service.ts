import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/base.service';

@Injectable()
export class GroupsService {

    resourcesKey: string = this.baseService.resourcesKeys.org.group;

    public constructor(private baseService: BaseService) {

    }

    getGroupTree(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'tree'}, callback, queryParam);
    }

    addGroup(payload, callback) {
        return this.baseService.post(this.resourcesKey, {}, payload, callback);
    }

    updateGroup(payload, callback) {
        return this.baseService.put(this.resourcesKey, {}, payload, callback);
    }

    delGroup(payload, callback) {
        return this.baseService.delete(this.resourcesKey, {}, payload, callback);
    }

    checkedGroupName(payload, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'checked'}, callback, payload);
    }

    getUnificationByGroupId(queryParam, callback) {
        return this.baseService.get(this.resourcesKey, {param: 'unification'}, callback, queryParam);
    }
}
