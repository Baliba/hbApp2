import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AdMobService } from './ad-mob.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private admobFreeService: AdMobService
  ) {
    this.initializeApp();
  }

  initializeApp() {
      this.platform.ready().then(() => {
      //this.admobFreeService.BannerAd();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
