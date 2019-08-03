import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthorizationComponent} from "../setting/authorization/authorization.component";
import {DeviceComponent} from "./device/device.component";
import {PeopleAuthorizationComponent} from "./peopleAuthorization/people.authorization.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {path: 'device', component: DeviceComponent},
            {path: 'moduleAuth', component: AuthorizationComponent},
            {path: 'peopleAuth', component: PeopleAuthorizationComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EquipmentRoutingModule {
}
