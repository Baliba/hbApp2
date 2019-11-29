
import { Component, OnInit, Injectable, Inject  } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { NavController,  LoadingController, ToastController} from '@ionic/angular';
import {FormControl} from '@angular/forms';
import { GetAudioService } from '../services/get-audio.service';
import {pluck, filter, map, distinctUntilChanged} from 'rxjs/operators';
import { AppConfig } from '../Interface/AppConfig';
import { AdMobService } from '../services/ad-mob.service';
import { PlaylistService } from '../providers/playlist.service';
import { AnimationService, AnimationBuilder  } from 'css-animator';
import { Facebook } from '@ionic-native/facebook/ngx';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  defaultImage: string = "assets/icon.png";
  [x: string]: any;
  bsearch;
  query;
  files:any=[];
  hfiles:any=[];
  kfiles:any=[];
  tlong=false;
  timeOutToSearch: any;
  nextUrl: any;
  newData: any;
  msgUnload: string;
  settings:any = {
    automatic:false,
    showImage:true,
    randomly:false,
    statistic:true,
    autoplay:false,
    cats:[]
  }
  loggedIn=false;
  private animator: AnimationBuilder;
  DEV = AppConfig.DEV;
  constructor(
   @Inject(ToastController) public toastController: ToastController,
   public navCtrl: NavController,
   public loadingCtrl: LoadingController,
   public cloudProvider: GetAudioService,
   private bd: PlaylistService,
   private admobFreeService: AdMobService,
   @Inject(AnimationService) animationService: AnimationService,
   @Inject(Facebook) private fb: Facebook
    ){

    this.animator = animationService.builder();
    this.bd.getUser().then(rep => {
      if(rep!=null && rep!=""){
        this.initData(rep);
        this.loggedIn = true;
        this.setLoginStatus();
      }
    });

    let i = this.randomInt(1,10) ;
    if(i<6){
      this.showRewardVideo();
    }
  }
  private type_log=1;
  setLoginStatus(){
    this.fb.getLoginStatus().then(res => {
          if (res.status === "connect") {
              this.type_log=2;
            }
        });
  }


  emitAnimate(e) {
    this.animator.setType(e.anim).show(e.el).then(() => { });
  }
  animateHide(l, e) {
    return this.animator.setType(e).hide(l);
  }
  animateShow(l, e) {
    return this.animator.setType(e).show(l);
  }
  emitNotLogin(e) {
    this.presentToast(e);
  }
  initData(rep) {
    if (rep != null) {
      this.loggedIn = true;
      this.myUser = rep;
      this.users = this.myUser.user_data;
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


  toggleSearch() {
    this.bsearch=!this.bsearch;
    if(this.bsearch) {
      this.setMsg("Please enter what you want to search and wait.");
      this.hfiles = this.files;
      this.files = this.kfiles;
    } else {
      this.files=this.hfiles;
      this.tlong=false;
    }
  }
   public keySeachDown(e){
    if(this.timeOutToSearch!=undefined){
       clearTimeout(this.timeOutToSearch);
       this.timeOutToSearch=undefined;
    }
  }
   public  keySeachUp(e){
   e=e.target.value;
   this.tlong = false;
   if(e!=""){
  this.timeOutToSearch = setTimeout(()=>{
     let u = 'Bo/@Hb/query/5/';
     //this.files=[];
     this.makeSearch(u,e);
    },2000);
    } else{
    	this.setMsg("Please enter what you want to search and wait.");
        this.files=[];
        this.kfile=[];;
   }
  }
  checkAgain(){
     this.tlong = false;
     this.getDocuments();
   }
   setLong(e){
     this.timeOutLoad = setTimeout(()=>{
      this.setMsg(e);
     },15000);
   }

   setMsg(e){
       this.tlong = true;
       this.msgUnload=e;
   }

randomInt(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(){
    this.admobFreeService.BannerAd();
  }

  showInterstitial() {
    this.admobFreeService.InterstitialAd();
  }

  showRewardVideo() {
    this.admobFreeService.RewardVideoAd();
  }

  getDate(e){
    return e;
  }
  UTF8toStr(s){
  return decodeURIComponent(escape(s));
  }
   async  makeSearch(u,e){
   const data = await this.cloudProvider.getQuery(u,e).then(res => {
       this.newData = res[4];
       this.nextUrl = res[2];
       if(this.newData.length!=0){
       if(this.bsearch){
          this.files=[];
          this.kfiles=[];
          this.addNews();
        }else{
          this.kfile=this.newData;
        }
        }else{
         this.setMsg("Nothing found for your search.");
       }
      }).catch(()=>{
      	  this.setMsg("You have a internet connection problem.");
      });
  }

  async  doRefresh(event) {
    if (this.nextUrl !== '') {
    if(!this.bsearch) {
      const data = await this.cloudProvider.getFiles(this.nextUrl).then(res => {
        this.newData = res[4];
        this.nextUrl = res[2];
        this.addNews();
        event.target.complete();
      }).catch(()=>{
      	 event.target.complete();
      });
     } else {
        this.makeSearchNext(this.nextUrl,this.query,event);
     }
    } else {
      event.target.complete();
    }
  }

   public getImg(url) {
   if (url == null || url == "") {
        return "";
    }
    url = AppConfig.getImg(url);
   return url;
  }

   async  makeSearchNext(u,e,event){
   const data = await this.cloudProvider.getQuery(u,e).then(res => {
       this.newData = res[4];
       this.nextUrl = res[2];
       event.target.complete();
       if(this.newData.length!=0){
       if(this.bsearch){
          this.kfile=[];
          this.addNews();
        }else{
          this.kfile=this.newData;
        }
        }else{
         this.tlong = true;
         this.msgUnload="Nothing found for your search.";
       }
      }).catch(()=>{
      	 event.target.complete();
      });
  }
   formatUrl(){
    let param ="5|";
    let n = this.settings.cats;
    let rep = n.join(",");
    param += rep;
    return 'Bo/@Hb/listPub/'+param+'/';
  }
   async getDocuments() {
     //this.setLong("Please check your internet connection.");
    if (this.files.length === 0) {
       const data = await this.cloudProvider.getFiles(this.formatUrl()).then(res => {
       this.log(res);
       this.newData = res[0];
       this.nextUrl = res[2];
       clearTimeout(this.timeOutLoad);
       this.tlong = false;
       this.timeOutLoad=undefined;
       if(this.newData.length!=0){
       this.addNews();
       }else{
         this.setMsg("No news found,\n Please check your configuration.\n");
       }
      }).catch(()=>{
      	  // this.setMsg("Please check your internet connection");
      });
    }
   }
  log(t) {
     console.log(t);
  }
  ionViewWillEnter(){
      this.bd.getMenu().then(res=>{
        if(res!=null){
        this.settings = res;
        }
      this.getDocuments();
      }).catch(()=>{
         this.getDocuments();
      });
   }

    addNews() {
  	 for (let i = 0; i < this.newData.length; i++) {
          if(this.isNews(this.newData[i])){
            this.files.unshift(this.newData[i]);
           }
        }
  }

   isNews(f){
    if(this.files.some( (file) => file.id_pub === f.id_pub)) {
       return false;
    }
    return true;
  }
}
