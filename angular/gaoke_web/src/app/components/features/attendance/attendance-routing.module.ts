import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ProjectDailyComponent} from "./projectDaily/project.daily.component";
import {ProjectComponent} from "./project/project.component";
import {PropertyComponent} from "./property/property.component";
import {PropertyDailyComponent} from "./propertyDaily/property.daily.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {path: 'propertyAttend', component: PropertyComponent},
            {path: 'projectAttend', component: ProjectComponent},
            {path: 'propertyDaily', component: PropertyDailyComponent},
            {path: 'projectDaily', component: ProjectDailyComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AttendanceRoutingModule {
}
