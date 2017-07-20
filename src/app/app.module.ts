import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material'

// Firebase
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { environment } from 'environments/environment'

// UNC CS Planner Services
import { AuthService } from './services/auth.service'
import { PostService } from './services/post.service'
import { CommentService } from './services/comment.service'
import { UserContextService } from './services/user-context.service'

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component'
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommunityPreviewComponent } from './preview/community-preview/community-preview.component';
import { RoadmapPreviewComponent } from './preview/roadmap-preview/roadmap-preview.component';
import { ProfilePreviewComponent } from './preview/profile-preview/profile-preview.component';
import { InfoPreviewComponent } from './preview/info-preview/info-preview.component';
import { CommunityComponent } from './community/community.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { ProfileComponent } from './profile/profile.component';
import { InfoComponent } from './info/info.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { OrdinalPipe } from './ordinal.pipe';
import { LoginComponent } from './login/login.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { PostPagerComponent } from './post-pager/post-pager.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    CommunityPreviewComponent,
    RoadmapPreviewComponent,
    ProfilePreviewComponent,
    InfoPreviewComponent,
    CommunityComponent,
    RoadmapComponent,
    ProfileComponent,
    InfoComponent,
    CourseDetailComponent,
    CourseCardComponent,
    OrdinalPipe,
    LoginComponent,
    PostComponent,
    CommentComponent,
    PostPagerComponent,
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
  ],
  providers: [ PostService, AuthService, UserContextService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
