import {Component} from '@angular/core';
import {detectBody} from '../../../app.helpers';
import {MenuService} from '../../features/menu/menu.service';
import {Constants} from '../../../common/constants';
import {Router} from '@angular/router';

@Component({
    selector: 'atnd-basic',
    templateUrl: 'basicLayout.template.html',
    host: {
        '(window:resize)': 'onResize()'
    }
})
export class BasicLayoutComponent {

    getMenus: boolean = Constants.sideMenus ? true : false;

    public ngOnInit(): any {
        if (!sessionStorage.getItem(Constants.AUTH_KEY)) {
            this.router.navigate(['login']);
        }
        if (!this.getMenus) {
            let thisComponent = this;
            this.menuService.getLeftMenus(function (result) {
                Constants.sideMenus = JSON.stringify(result);
                thisComponent.getMenus = true;
            });
        }
        detectBody();
    }

    public onResize() {
        detectBody();
    }

    constructor(private menuService: MenuService, private router: Router) {
    }

}
