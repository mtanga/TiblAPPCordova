import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { AuthService } from "./shared/services/data/auth.service";
import { NewcomponentPageModule } from './components/newcomponent/newcomponent.module';  
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';

import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
     IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAuthModule,
      NgxPhotoEditorModule,
      AngularFirestoreModule,
      NgxIonicImageViewerModule,
      AngularFireStorageModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule.enablePersistence(),
      NewcomponentPageModule
    ],
  providers: [
    AuthService,
    ImagePicker,
    SocialSharing,
    SplashScreen,
    CallNumber,
    InAppBrowser,
    Camera,
    Crop,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
