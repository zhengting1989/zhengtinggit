import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {UsersService} from '../../personnel/users/users.service';
import {SpinService} from '../../../../common/spin/spin.service';
import {DeviceService} from '../device/device.service';
import {Constants} from '../../../../common/constants';
import {PeopleAuthorizationModuleComponent} from './people.authorization.module.component';

@Component({
    selector: 'atnd-people-authorization-table',
    templateUrl: 'people.authorization.table.template.html',
    styleUrls: ['./people.attendance.template.scss']
})
export class PeopleAuthorizationTableComponent {
    isAdmin: boolean;

    public constructor(private modalService: BsModalService,
                       public usersService: UsersService,
                       private spinService: SpinService,
                       private deviceService: DeviceService,) {
    }

    @Output() fromChild = new EventEmitter();
    @Input() moduleIdList: any = [];
    @Input() userId: any;
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
        if (this.userId) {
            this.spinService.spin(true);
            this.getdevice(pageIndex, this.perPagNo)
        }
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.pageIndex = 1;
        let showbutton = Constants.loginUser == 'loginUser' ? {} : JSON.parse(Constants.loginUser);
        this.isAdmin = showbutton.admin ? true : false;
    }

    openModal() {
        const initialState = {
            initialState: {
                moduleIdList: this.moduleIdList,
                routerUrl: this.routerUrl,
                userId: this.userId
            }
        };
        this.modalRef = this.modalService.show(PeopleAuthorizationModuleComponent, initialState);
        this.modalRef.content.onSubmitForm.subscribe(modalRef => {
            this.getdevice(this.pageIndex, this.perPagNo)
        });
    }

    formatter(value) {
        if (value == 1) {
            return '<span class="label label-primary">正常</span>';
        }
        if (value == 2) {
            return '<span class="label label-warning">异常</span>';
        }
        if (value == 3) {
            return '<span class="label label-danger">停用</span>';
        }
    }

    keyword: any = '';

    getdevice(pageIndex, eventPerPagNo, ispage?) {
        let arrobj: any = {};
        if (ispage) {
            arrobj = {
                keyword: this.keyword,
                pageIndex: 1,
                perPageNo: eventPerPagNo,
                userId: this.userId
            }
            this.total = 0;
        } else {
            arrobj = {
                pageIndex: pageIndex,
                perPageNo: eventPerPagNo,
                userId: this.userId,
                keyword: this.keyword
            }
        }
        this.deviceService.getPeopleAuthPage(arrobj, (res: any) => {
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
            this.userTable = res.data
            this.spinService.spin(false);
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
