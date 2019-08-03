import {ExtraOptions, RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './components/appviews/login/login.component';
import {BlankLayoutComponent} from './components/framework/layouts/blankLayout.component';
import {BasicLayoutComponent} from './components/framework/layouts/basicLayout.component';
import {LoginSelfComponent} from './components/appviews/self/login.self.component';
import {DashboardComponent} from './components/features/dashboards/dashboard.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        path: 'dashboards', component: BasicLayoutComponent,
        children: [
            {path: '', component: DashboardComponent}
        ]
    },
    {
        path: 'setting', component: BasicLayoutComponent,
        loadChildren: 'app/components/features/setting/setting.module#SettingModule'
    },
    {
        path: 'attendance', component: BasicLayoutComponent,
        loadChildren: 'app/components/features/attendance/attendance.module#AttendanceModule'
    },
    {
        path: 'equipment', component: BasicLayoutComponent,
        loadChildren: 'app/components/features/equipment/equipment.module#EquipmentModule'
    },
    {
        path: 'personnel', component: BasicLayoutComponent,
        loadChildren: 'app/components/features/personnel/personnel.module#PersonnelModule'
    },
    {
        path: '', component: BasicLayoutComponent,
        children: [
            {path: 'starterview', component: DashboardComponent},
            {path: 'loginSelf', component: LoginSelfComponent}
        ]
    },
    {
        path: '', component: BlankLayoutComponent,
        children: [
            {path: 'login', component: LoginComponent},
        ]
    },
    {path: '**', redirectTo: 'login'}
];

const config: ExtraOptions = {
    useHash: true,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}