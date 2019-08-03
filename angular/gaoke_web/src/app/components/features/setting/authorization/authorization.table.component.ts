import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AuthorizationModuleComponent} from './authorization.module.component';
import {UsersService} from '../../personnel/users/users.service';
import {SpinService} from '../../../../common/spin/spin.service';
import {DeviceService} from '../../equipment/device/device.service';
import {Constants} from '../../../../common/constants';

@Component({
    selector: 'atnd-authorization-table',
    templateUrl: 'authorization.table.template.html',
    styleUrls: ['./attendance.template.scss']
})
export class AuthorizationTableComponent {
    isAdmin: boolean;
    isAdminPlat: boolean;

    public constructor(private modalService: BsModalService,
                       public usersService: UsersService,
                       private spinService: SpinService,
                       private deviceService: DeviceService,) {

    }

    @Output() fromChild = new EventEmitter();
    @Input() moduleIdList: any = [];
    @Input() userIdList: any;
    @Input() userTable: any;
    @Input() total: any;
    @Input() routerUrl: any;
    modalRef: BsModalRef;
    perPagNo: number = 50;
    pageIndex: number = 1;
    perPageChange: any;

    //分页代码修改
    onPaginationChanged(event) {
        let eventPerPagNo = Number(event.perPageNo);
        let eventPageIndex = Number(event.pageIndex);
        this.pageIndex = eventPageIndex;
        if (eventPerPagNo != this.perPagNo) {
            this.perPagNo = eventPerPagNo;
        }
        this.perPageChange = event.perPageChange;
        if (this.perPageChange) {
            this.total = 0;
        }
        let pageIndex = event.pageIndex;
        this.fromChild.emit(this.perPagNo)
        if (this.moduleIdList.length > 0) {
            this.spinService.spin(true);
            this.getdevice(pageIndex, this.perPagNo)
        }
    }

    pagetitle: any;

    ngOnInit() {
        if (this.routerUrl == 'authorization') {
            this.pagetitle = '维护授权'
        } else {
            this.pagetitle = '模块授权'
        }
    }

    ngOnChanges() {
        this.pageIndex = 1;
        let showbutton = Constants.loginUser == 'loginUser' ? {} : JSON.parse(Constants.loginUser);
        this.isAdminPlat = showbutton.admin && showbutton.unificationType == "platform" ? true : false;
        this.isAdmin = showbutton.admin ? true : false;
    }

    openModal() {
        const initialState = {
            initialState: {
                moduleIdList: this.moduleIdList,
                routerUrl: this.routerUrl,
            }
        };
        this.modalRef = this.modalService.show(AuthorizationModuleComponent, initialState);
        this.modalRef.content.onSubmitForm.subscribe(modalRef => {
            this.getdevice(this.pageIndex, this.perPagNo)
        });
    }

    formatter(value) {
        return value ? '<span class="label label-primary">在职</span>' : '<span class="label label-warning">离职</span>';
    }

    keyword: any = '';

    getdevice(pageIndex, eventPerPagNo, ispage?) {
        let deviceParm = {}
        if (this.routerUrl == 'authorization') {
            deviceParm = {param: 'auth/maintain/page'}
        } else {
            deviceParm = {param: 'auth/usage/page'}
        }

        let arrobj: any = {};
        if (ispage) {
            arrobj = {
                keyword: this.keyword,
                pageIndex: 1,
                perPageNo: eventPerPagNo,
                moduleIdList: this.moduleIdList
            }
            this.total = 0;
        } else {
            arrobj = {
                pageIndex: pageIndex,
                perPageNo: eventPerPagNo,
                moduleIdList: this.moduleIdList/*,
      keyword:this.keyword*/
            }
        }
        this.deviceService.getDeviceAuthPage(deviceParm, arrobj, (res: any) => {
            this.total = res.totalNumbers
            if (this.perPageChange) {
                this.total = res ? res.totalNumbers : 0;
            }
            let array = [];
            if (res['data']) {
                res['data'].forEach(element => {
                    array.push(element.userId)
                });
            }
            let parm: any = {}
            if (ispage) {
                parm = {
                    userIds: array,
                }
            } else {
                parm = {
                    pageIndex: pageIndex,
                    perPageNo: eventPerPagNo,
                    userIds: array/*,
        keyword:this.keyword*/
                }
            }

            this.usersService.getUsersByIds(parm, (data) => {
                this.userTable = data
                this.spinService.spin(false);
            })
        })
    }

    enterSearch(e) {
        if (e.keyCode == 13) {
            this.search();
        }
    }

    search() {
        this.spinService.spin(true);

        this.getdevice(1, this.perPagNo, true)
    }
}
