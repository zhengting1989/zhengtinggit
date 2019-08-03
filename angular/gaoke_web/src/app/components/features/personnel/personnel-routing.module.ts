import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UsersComponent} from "./users/users.component";
import {GroupsComponent} from "./groups/groups.component";
import {UnificationsComponent} from './unifications/unifications.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {path: 'unifications', component: UnificationsComponent},
            {path: 'groups', component: GroupsComponent},
            {path: 'users', component: UsersComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PersonnelRoutingModule {
}
