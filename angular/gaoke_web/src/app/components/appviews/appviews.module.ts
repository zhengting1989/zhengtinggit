import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StarterViewComponent} from './starter/starterview.component';
import {LoginComponent} from './login/login.component';
import {LoginService} from './login/login.service';
import {FormsModule} from '@angular/forms';
import {DirectivesModule} from '../../common/directives/directives.module';
import {LoginSelfComponent} from './self/login.self.component';
import {ChooseUnificationComponent} from './login/choose.unification.component';
import {ModalModule} from 'ngx-bootstrap';
import {CommonModule} from "@angular/common";
import {ResetPasswordComponent} from './self/reset.password.component';

@NgModule({
    declarations: [
        StarterViewComponent,
        LoginComponent,
        LoginSelfComponent,
        ChooseUnificationComponent,
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        DirectivesModule,
        ModalModule.forRoot()
    ],
    exports: [
        StarterViewComponent,
        LoginComponent,
        LoginSelfComponent
    ],
    providers: [
        LoginService
    ],
    entryComponents: [
        ChooseUnificationComponent,
        ResetPasswordComponent
    ]
})

export class AppviewsModule {
}
