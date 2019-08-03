import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LogsComponent} from './logs/logs.component';
import {SoftwareComponent} from './software/software.component';
import {AboutComponent} from './about/about.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {AuthorizationComponent} from './authorization/authorization.component';
import { ModuleQueryComponent } from './moduleQuery/module.query.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {path: 'upgrade', component: UpgradeComponent},
            {path: 'authorization', component: AuthorizationComponent},
            {path: 'about', component: AboutComponent},
            {path: 'logs', component: LogsComponent},
            {path: 'software', component: SoftwareComponent},
            {path: 'moduleQuery', component: ModuleQueryComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SettingRoutingModule {
}
