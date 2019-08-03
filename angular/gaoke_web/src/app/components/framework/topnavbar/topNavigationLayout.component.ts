import {Component} from '@angular/core';
import {detectBody} from '../../../app.helpers';

declare var jQuery: any;

@Component({
    selector: 'atnd-topnavigationlayout',
    templateUrl: 'topNavigationLayout.template.html',
    host: {
        '(window:resize)': 'onResize()'
    }
})
export class TopNavigationLayoutComponent {

    public ngOnInit(): any {
        detectBody();
    }

    public onResize() {
        detectBody();
    }

}
