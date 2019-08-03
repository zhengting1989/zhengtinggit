import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../../../common/constants';

declare var jQuery: any;

@Component({
    selector: 'atnd-top-title',
    template: `
        <div class="row wrapper border-bottom white-bg page-heading" *ngIf="childSideMenuStrong">
            <div class="col-lg-10">
                <h2>{{childSideMenuStrong}}</h2>
                <ol class="breadcrumb">
                    <li>
                        <a [routerLink]="['/starterview']">首页</a>
                    </li>
                    <li *ngIf="sideMenuStrong">
                        <a>{{sideMenuStrong}}</a>
                    </li>
                    <li class="active">
                        <strong>{{childSideMenuStrong}}</strong>
                    </li>
                </ol>
            </div>
            <div class="col-lg-2">

            </div>
        </div>
    `
})
export class TopTitleComponent implements OnInit, OnDestroy {


    sideMenuStrong: string;
    childSideMenuStrong: string;
    interval;
    oldRouterUrl: string;

    ngOnInit(): void {
        let dyComponent = this;
        this.interval = setInterval(() => {
            dyComponent.initMenuStrongName();
        }, 50);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    constructor(private router: Router) {
    }

    initMenuStrongName() {
        let routerUrl = this.router.url;
        if ('/dashboards' === routerUrl) {
            this.childSideMenuStrong = '';
            return;
        }
        if (routerUrl != this.oldRouterUrl) {
            this.oldRouterUrl = routerUrl;
            this.sideMenuStrong = '';
            this.childSideMenuStrong = '';
            let sideMenus: any = JSON.parse(Constants.sideMenus) || [];
            for (var idx = 0, length = sideMenus.length; idx < length; idx++) {
                let sideMenu = sideMenus[idx];
                let activeRoute = '/' + sideMenu.activeRoute;
                if (activeRoute === routerUrl) {
                    this.childSideMenuStrong = sideMenu.name;
                    break;
                }
                let flag: boolean = false;
                let childMenus = sideMenu.childMenus || [];
                for (var icx = 0, childLength = childMenus.length; icx < childLength; icx++) {
                    let childSideMenu = childMenus[icx];
                    let childActiveRoute = '/' + childSideMenu.parentActiveRoute + '/' + childSideMenu.activeRoute;
                    if (childActiveRoute === routerUrl) {
                        this.sideMenuStrong = sideMenu.name;
                        this.childSideMenuStrong = childSideMenu.name;
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    break;
                }
            }
        }
    }
}
