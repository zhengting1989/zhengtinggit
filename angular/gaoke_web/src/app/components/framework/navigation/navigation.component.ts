import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import {Constants} from '../../../common/constants';
import {UsersService} from '../../features/personnel/users/users.service';

declare var jQuery: any;

@Component({
    selector: 'atnd-navigation',
    templateUrl: 'navigation.template.html'
})

export class NavigationComponent implements OnInit {

    constructor(private router: Router, private usersService: UsersService) {
    }

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();

        if (jQuery('body').hasClass('fixed-sidebar')) {
            jQuery('.sidebar-collapse').slimscroll({
                height: '100%'
            })
        }
    }

    sideMenus: any = JSON.parse(Constants.sideMenus);

    activeRoute(routename: string): boolean {
        return this.router.url.indexOf(routename) > -1;
    }

    gotoActiveRoute(sideMenu) {
        Constants.access = (sideMenu.permission === '1' || sideMenu.permission === 1);
        let url = '';
        if (sideMenu.parentActiveRoute) {
            url = '/' + sideMenu.parentActiveRoute;
        }
        url += '/' + sideMenu.activeRoute;

        this.router.navigate([url]);
    }

    ngOnInit(): void {
        this.initPagePermission();
        this.getLoginUserInfo();
    }

    initPagePermission() {
        let routerUrl = this.router.url;
        let sideMenus: any = JSON.parse(Constants.sideMenus) || [];
        for (var idx = 0, length = sideMenus.length; idx < length; idx++) {
            let sideMenu = sideMenus[idx];
            let activeRoute = '/' + sideMenu.activeRoute;
            if (activeRoute === routerUrl) {
                Constants.access = (sideMenu.permission === '1' || sideMenu.permission === 1);
                break;
            }
            let flag: boolean = false;
            let childMenus = sideMenu.childMenus || [];
            for (var icx = 0, childLength = childMenus.length; icx < childLength; icx++) {
                let childSideMenu = childMenus[icx];
                let childActiveRoute = '/' + childSideMenu.parentActiveRoute + '/' + childSideMenu.activeRoute;
                if (childActiveRoute === routerUrl) {
                    Constants.access = (childSideMenu.permission === '1' || childSideMenu.permission === 1);
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
    }

    loginUser: any = Constants.loginUser != 'loginUser' ? JSON.parse(Constants.loginUser) : 'loginUser';

    getLoginUserInfo() {
        let thisComponent = this;
        if (this.loginUser == 'loginUser') {
            this.usersService.getSelf(function (result) {
                Constants.loginUser = JSON.stringify(result);
                thisComponent.loginUser = result;
            });
        }
    }

    goSelfPage() {
        this.router.navigate(['loginSelf']);
    }
}
