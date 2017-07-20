import { NgModule } from '@angular/core'
import { RouterModule, Routes, CanActivate } from '@angular/router'

import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth'
import { environment } from '../environments/environment'

import { HeaderComponent } from './header/header.component'
import { CommunityComponent } from './community/community.component'
import { RoadmapComponent } from './roadmap/roadmap.component'
import { ProfileComponent } from './profile/profile.component'
import { LoginComponent } from './login/login.component'
import { InfoComponent } from './info/info.component'
import { CourseDetailComponent } from './course-detail/course-detail.component'

import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
    { path: '', redirectTo: '/community', pathMatch: 'full' },
    { path: 'community', component: CommunityComponent },
    { path: 'roadmap', component: RoadmapComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [ AuthGuard ] },
    { path: 'profile/:username', component: ProfileComponent },
    { path: 'login', component: LoginComponent },
    { path: 'info', component: InfoComponent },
    { path: 'courses/:dept/:number', component: CourseDetailComponent },
    { path: 'courses/:dept/:number/:modifier', component: CourseDetailComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule {

}
