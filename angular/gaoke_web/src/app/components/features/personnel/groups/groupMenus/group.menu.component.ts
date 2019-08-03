import {Component, Input, OnInit} from '@angular/core';
import {SpinService} from '../../../../../common/spin/spin.service';
import {GroupMenuService} from './group.menu.service';
import {NativeToastrService} from '../../../../../common/native.toastr.service';

@Component({
    selector: 'atnd-groups-menu',
    template: `
        <div class="row" *ngIf="haveMenus">
            <div class="col-md-7">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        功能设置
                    </div>
                    <div class="panel-body" id="feature-authority">
                        <div class="form-group fixed-height-row" *ngFor="let feature of features;">
                            <label class="col-md-3 control-label">{{feature?.name}}</label>
                            <div class="col-md-5">
                                <select class="form-control adjust-vertical-pos" read-only
                                        [(ngModel)]="feature.accessRight">
                                    <option value="0">禁止访问</option>
                                    <option value="1">允许访问</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <a class="primary-right-link"
                                   (click)="changePages(feature?.pages,feature?.name)">
                                    页面设置
                                    <i class="fa fa-long-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                        <div class="form-group" *ngIf="features?.length <= 0">
                            当前部门没有可操作的权限
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-5" *ngIf="featureName">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        页面设置 - {{featureName}}
                    </div>
                    <div class="panel-body" id="page-authority">
                        <div class="form-group fixed-height-row" *ngFor="let page of pages;">
                            <label class="col-md-5 control-label">{{page?.name}}</label>
                            <div class="col-md-7">
                                <select class="form-control adjust-vertical-pos" read-only [(ngModel)]="page.accessRight">
                                    <option value="0">禁止访问</option>
                                    <option value="1">只读</option>
                                    <option value="2" *ngIf="page.accessControl == 2">允许访问</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" *ngIf="pages?.length > 0">
                            <div class="col-md-4">
                                <a class="primary-link fa fa-times-circle-o" hide-node (click)="clickChangePages(pages,'0')">
                                    全部禁止
                                </a>
                            </div>
                            <div class="col-md-4">
                                <a class="primary-link fa fa-times-circle-o" hide-node  (click)="clickChangePages(pages,'1')">
                                    全部只读
                                </a>
                            </div>
                            <div class="col-md-4">
                                <a class="primary-link fa fa-check-circle-o" hide-node (click)="clickChangePages(pages,'2')">
                                    最大权限
                                </a>
                            </div>
                        </div>
                        <div class="form-group" *ngIf="pages?.length <= 0">
                            {{featureName}} 不存在子级页面
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <div class="modal-footer">
                    <button type="button" hide-node
                            class="btn btn-info"
                            (click)="saveFeature()">
                        <i class="fa fa-save"></i> 保存
                    </button>
                </div>
            </div>
        </div>
        <div class="row" *ngIf="!haveMenus"> 
            <div class="col-sm-3"></div>
            <div class="col-sm-6 text-center widget navy-bg p-xl animated wobble" style="border-radius: 15px / 20px!important;"> 
                <h1>
                    内置分组
                </h1>
                <ul class="list-unstyled m-t-md"> 
                    <li>
                        <span class="fa fa-bell"></span>
                        <label>  内置分组不提供权限配置</label> 
                    </li> 
                </ul> 
            </div>
            <div class="col-sm-3"></div>
        </div>
    `,
    styleUrls: ['./group.menu.template.scss']
})
export class GroupMenuComponent implements OnInit {

    @Input('nodeModel') nodeModel: any;
    haveMenus: boolean = true;
    features: any = [];
    pages: any = [];
    featureName: string;

    public constructor(public groupMenuService: GroupMenuService,
                       private spinService: SpinService,
                       private nativeToastrService: NativeToastrService) {
    }

    ngOnInit(): void {
    }

    clickChangePages(pages, accessRight) {
        pages = pages || [];
        pages.forEach(function (page) {
            let accessControl = Number(page.accessControl);
            if (accessControl == 2) {
                page.accessRight = accessRight;
            } else {
                if (accessRight === '2') {
                    page.accessRight = '1';
                } else {
                    page.accessRight = accessRight;
                }
            }
        });
    }

    ngOnChanges() {
        if (this.nodeModel) {
            this.haveMenus = !(this.nodeModel.readonly && !this.nodeModel.onlyAddChildren);
            if (this.haveMenus) {
                let thisComponent = this;
                this.groupMenuService.getGroupMenus({groupId: this.nodeModel.nodeId}, function (result) {
                    result = result || [];
                    thisComponent.pages = [];
                    thisComponent.featureName = '';
                    result.forEach(function (feature) {
                        feature.accessRight = '' + feature.accessRight;
                        feature.pages = feature.pages || [];
                        feature.pages.forEach(function (page) {
                            page.accessRight = '' + page.accessRight;
                        });
                    });
                    thisComponent.features = result;
                })
            } else {
                this.features = [];
                this.pages = [];
                this.featureName = '';
            }
        }
    }

    changePages(pages, featureName) {
        this.featureName = featureName;
        this.pages = pages || [];
    }

    saveFeature() {
        let thisComponent = this;
        this.spinService.spin(true);
        this.groupMenuService.saveGroupMenus(this.checkFeature(), function (result) {
            thisComponent.spinService.spin(false);
            thisComponent.nativeToastrService.clearToastr();
            thisComponent.nativeToastrService.showSuccess('菜单设置成功！')
        })
    }

    checkFeature() {
        let featureIds: string = '';
        let pageIds: string = '';
        let readonlyPageIds: string = '';
        this.features = this.features || [];
        this.features.forEach(function (feature) {
            let featureMenuId = feature.menuId;
            let featureAccessRight = feature.accessRight;
            if (featureAccessRight === 1 || featureAccessRight === '1') {
                let pages = feature.pages || [];
                let featurePageIds: string = '';
                let featureReadonlyPageIds: string = '';
                let flag: boolean = false;
                pages.forEach(function (page) {
                    let pageMenuId = page.menuId;
                    let pageAccessRight = page.accessRight;
                    if (pageAccessRight === 1 || pageAccessRight === '1') {
                        if (featureReadonlyPageIds && featureReadonlyPageIds.length > 0) {
                            featureReadonlyPageIds += ',' + pageMenuId;
                        } else {
                            featureReadonlyPageIds += '' + pageMenuId;
                        }
                        flag = true;
                    }
                    if (pageAccessRight === 2 || pageAccessRight === '2') {
                        if (featurePageIds && featurePageIds.length > 0) {
                            featurePageIds += ',' + pageMenuId;
                        } else {
                            featurePageIds += '' + pageMenuId;
                        }
                        flag = true;
                    }
                });
                if (pages.length > 0) {
                    if (flag) {
                        if (readonlyPageIds && readonlyPageIds.length > 0) {
                            readonlyPageIds += ',' + featureReadonlyPageIds;
                        } else {
                            readonlyPageIds += '' + featureReadonlyPageIds;
                        }
                        if (pageIds && pageIds.length > 0) {
                            pageIds += ',' + featurePageIds;
                        } else {
                            pageIds += '' + featurePageIds;
                        }
                        if (featureIds && featureIds.length > 0) {
                            featureIds += ',' + featureMenuId;
                        } else {
                            featureIds += '' + featureMenuId;
                        }
                    }
                } else {
                    if (featureIds && featureIds.length > 0) {
                        featureIds += ',' + featureMenuId;
                    } else {
                        featureIds += '' + featureMenuId;
                    }
                }
            }
        });
        return {
            features: featureIds,
            pages: pageIds,
            groupId: this.nodeModel.nodeId,
            readonlyPages: readonlyPageIds
        };
    }

}

