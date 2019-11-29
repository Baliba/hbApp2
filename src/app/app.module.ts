import { FBAuthService } from './providers/fbauth.service';
import { IonicImageLoader } from 'ionic-image-loader';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { mediaStateReducer } from './Interface/Reducer';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AdMobService } from './services/ad-mob.service';
import { PlaylistService } from './providers/playlist.service';
import {  NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationService,AnimatesDirective } from "css-animator";
import { Facebook } from '@ionic-native/facebook/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentModule } from './components/component/component.module';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@NgModule({
  declarations: [
  AppComponent
  // AnimatesDirective
  ],
  entryComponents: [],
  exports:[],
  imports: [BrowserModule,
   StoreModule.forRoot({
      appState: mediaStateReducer
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule ,
    // tslint:disable-next-line: deprecation
    HttpModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicImageLoader.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
     AnimationService,
     WebView,
     AdMobFree,
     AdMobService,
     PlaylistService,
     FileTransfer,
     FBAuthService,
     FileTransferObject,
     Facebook,
     File,
     MusicControls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
