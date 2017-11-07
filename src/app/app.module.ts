import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MatTabsModule } from '@angular/material'
import { MatIconModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';


// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from 'environments/environment';

// UNC CS Planner Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component'
import { AppRoutingModule } from './app-routing.module';
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
import { ConfirmDeleteDialogComponent } from './dialogs/confirm-delete.component'
import { VerifyEmailDialogComponent } from './dialogs/verify-email.component'
import { PostPagerComponent } from './post-pager/post-pager.component';
import { ParagraphsPipe } from './paragraphs.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
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
    ConfirmDeleteDialogComponent,
    VerifyEmailDialogComponent,
    ParagraphsPipe
  ],
  imports: [
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    // MatGridListModule,
    FormsModule,
    HttpModule,
  ],
  entryComponents: [ConfirmDeleteDialogComponent, VerifyEmailDialogComponent],
  providers: [ PostService, AuthService, UserService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
