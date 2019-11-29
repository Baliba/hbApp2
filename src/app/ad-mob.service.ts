import { Injectable, Inject } from '@angular/core';
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdMobService {
  test=true;

  interstitialConfig: AdMobFreeInterstitialConfig = {
    autoShow: false,
    id: "ca-app-pub-8512011412233056/1875621045"
  };

  //Reward Video Ad's Configurations
  RewardVideoConfig: AdMobFreeRewardVideoConfig = {
   // isTesting: true, // Remove in production
    autoShow: false,
    id: "ca-app-pub-8512011412233056/8864427570"
  };

constructor( private admobFree: AdMobFree,public platform: Platform) {
  this.init();
}


 init(){
   this.platform.ready().then(() => {
     // Load ad configuration
     this.admobFree.interstitial.config(this.interstitialConfig);
     //Prepare Ad to Show
     this.admobFree.interstitial.prepare()
       .then(() => {
          //alert(1);
       }).catch(e => {
        // alert("interstitial - "+e);
       });
     // Load ad configuration
     this.admobFree.rewardVideo.config(this.RewardVideoConfig);
     //Prepare Ad to Show
     this.admobFree.rewardVideo.prepare()
       .then(() => {
         // alert(2);
       }).catch(e => {
       //alert("video - "+e);
     });

   });


   //Handle interstitial's close event to Prepare Ad again
   this.admobFree.on('admob.interstitial.events.CLOSE').subscribe(() => {
     this.admobFree.interstitial.prepare()
       .then(() => {
        // alert("Interstitial CLOSE");
       }).catch(e=>{
         //e => alert(e);
       });
   });
   //Handle Reward's close event to Prepare Ad again
   this.admobFree.on('admob.rewardvideo.events.CLOSE').subscribe(() => {
     this.admobFree.rewardVideo.prepare()
       .then(() => {
        // alert("Reward Video CLOSE");
       }).catch( e => {
         // e => alert(e);
       });

   });
 }

  BannerAd() {
    let bannerConfig: AdMobFreeBannerConfig = {
       autoShow: true,
       id: "ca-app-pub-8512011412233056/7125524827"
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.admobFree.banner.show();
    }).catch(e =>{
      //alert(e);
    });
  }

  InterstitialAd() {
    //Check if Ad is loaded
    this.admobFree.interstitial.isReady().then(() => {
      //Will show prepared Ad
      this.admobFree.interstitial.show().then(() => {
      }).catch( e => {});
    }).catch( e => {});
  }

  RewardVideoAd() {
    //Check if Ad is loaded
    this.admobFree.rewardVideo.isReady().then(() => {
      //Will show prepared Ad
      this.admobFree.rewardVideo.show().then(() => {
      }).catch(e => {});
    }).catch(e => {});
  }
}
