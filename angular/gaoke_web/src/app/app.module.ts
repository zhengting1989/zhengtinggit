import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppComponent} from './app.component';
import {ToastrModule} from 'ngx-toastr';
import {LayoutsModule} from './components/framework/layouts/layouts.module';
import {SpinComponent} from './common/spin/spin.component';
import {SpinService} from './common/spin/spin.service';
import {HttpClientModule} from '@angular/common/http';
import {NativeToastrService} from './common/native.toastr.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertService} from './common/alert.service';
import {GeneralErrorHandler} from './common/general.error.handler';
import {BaseService} from './common/base.service';
import {RestService} from './common/rest.service';
import {ResourceService} from './common/resource.service';
import {CommonComponentsModule} from './common/components/common.components.module';
import {DirectivesModule} from './common/directives/directives.module';
import {AppviewsModule} from "./components/appviews/appviews.module";
import {FeaturesModule} from "./components/features/features.module";
import {UsersService} from "./components/features/personnel/users/users.service";
import {GroupsService} from "./components/features/personnel/groups/groups.service";
import {UnificationsService} from "./components/features/personnel/unifications/unifications.service";
import {AppRoutingModule} from './app.routes';
import {DeviceService} from './components/features/equipment/device/device.service';

@NgModule({
    declarations: [
        AppComponent,
        SpinComponent
    ],
    imports: [
        FormsModule,
        HttpClientModule,
        LayoutsModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        AppviewsModule,
        FeaturesModule,
        ToastrModule.forRoot({
            newestOnTop: true
        }),
        CommonComponentsModule,
        DirectivesModule
    ],
    providers: [
        RestService,
        ResourceService,
        BaseService,
        SpinService,
        NativeToastrService,
        AlertService,
        UsersService,
        GroupsService,
        DeviceService,
        UnificationsService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: ErrorHandler, useClass: GeneralErrorHandler}
    ],
    bootstrap: [AppComponent],
    exports: [
        SpinComponent
    ]
})
export class AppModule {
}
