import { NgModule } from '@angular/core'
import { RouterModule, Routes, CanActivate } from '@angular/router'

import { UserContextService } from './services/user-context.service'

import { HeaderComponent } from './header/header.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { CommunityComponent } from './community/community.component'
import { RoadmapComponent } from './roadmap/roadmap.component'
import { ProfileComponent } from './profile/profile.component'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { InfoComponent } from './info/info.component'
import { CourseDetailComponent } from './course-detail/course-detail.component'

class LoginGuard implements CanActivate {

    constructor(){}

    canActivate(): boolean {
        return !localStorage.getItem('user');
    }
}

const routes: Routes = [
    { path: '', redirectTo: '/community', pathMatch: 'full' },
    { path: 'community', component: CommunityComponent },
    { path: 'roadmap', component: RoadmapComponent },
    { path: 'profile/:username', component: ProfileComponent},
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'info', component: InfoComponent },
    { path: 'courses/:dept/:number', component: CourseDetailComponent },
    { path: 'courses/:dept/:number/:modifier', component: CourseDetailComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [LoginGuard]
})

export class AppRoutingModule {

}