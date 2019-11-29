import { FBAuthService } from './../providers/fbauth.service';
import { Component, ViewChild, Injectable, Inject, ElementRef, Renderer, OnInit  } from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import { NavController,  LoadingController, ToastController} from '@ionic/angular';
import { AudioService } from '../audio.service';
import {FormControl} from '@angular/forms';
import {CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET} from '../Interface/MediaAction';
import {Store} from '@ngrx/store';
import { GetAudioService } from '../get-audio.service';
import {pluck, filter, map, distinctUntilChanged} from 'rxjs/operators';
import { AppConfig } from '../Interface/AppConfig';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AdMobService } from '../ad-mob.service';
import { PlaylistService } from '../providers/playlist.service';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { Facebook } from '@ionic-native/facebook/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
   animations: [
    trigger('showHide', [
      state(
        'active',
        style({
          opacity: 1
        })
      ),
      state(
        'inactive',
        style({
          opacity: 0
        })
      ),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('250ms ease-out'))
    ]), trigger('fadeInOut', [
       state('void', style({ opacity: '0' })),
       state('*', style({ opacity: '1' })),
       transition('void <=> *', animate('150ms ease-in'))
     ])
  ]
})
@Injectable()
export class Tab1Page implements OnInit {
  defaultImage: string = "assets/icon.png";
  files: any = [];
  hfiles: any = [];
  seekbar: FormControl = new FormControl('seekbar');
  state: any = {};
  onSeekState: boolean;
  currentFile: any = {};
  currentDL: any = {};
  displayFooter = 'inactive';
  loggedIn: Boolean=false;
  type_ent = [];
  newData = [];
  nImg = [];
  cpage = 1;
  nextUrl = '';
  hnextUrl = '';
  endscroll = true;
  arl = [];
  musicState: any = {size: '', time: ''};
  downloadFile: any;
  private fileTransfer: FileTransferObject;
  error;
  bsearch=false;
  timeOutToSearch=undefined;
  timeOutLoad=undefined;
  query;
  tlong=false;
  msgUnload;
  kfile=[];
  isDL=false;
  playlist : any=[];
  menu=false;
  cats : any=[];
  settings:any = {
    automatic:true,
    showImage:true,
    randomly:false,
    statistic:true,
    autoplay:false,
    cats:[],
    player:true,
  }
   myUser = {
        type_login:1,
        user_data:{},
    };
  loader=false;
  private type_log=1;
  DEV = AppConfig.DEV;
  @ViewChild('pElement',{read:ElementRef,static:false}) pElem: ElementRef;
  @ViewChild('pElement',{read:ElementRef,static:true}) ipElem: ElementRef;
  @ViewChild('content',{read:ElementRef,static:false})  content: ElementRef;
  //@ViewChild('content',{read:ElementRef,static:false}) content: Content;
  // @ViewChild('pElement', ) pElem : ElementRef;
   private animator: AnimationBuilder;
  constructor(
   @Inject(FileTransfer) private transfer: FileTransfer,
   @Inject(File)  private file: File,
   @Inject(ToastController) public toastController: ToastController,
   public navCtrl: NavController,
   public audioProvider: AudioService,
   public loadingCtrl: LoadingController,
   public cloudProvider: GetAudioService,
   private admobFreeService: AdMobService,
   private bd: PlaylistService,
   private store: Store<any>,
   @Inject(AnimationService)  animationService: AnimationService,
   @Inject(Facebook)  private fb: Facebook,
   @Inject(FBAuthService) private FBAuth: FBAuthService,
   @Inject(MusicControls) private musicControls: MusicControls
  ) {
    this.animator = animationService.builder();
// check login facebook
  this.bd.getUser().then(rep=>{
  if(rep!=null && rep!=""){
    this.initData(rep);
    this.loggedIn = true;
    this.setLoginStatus();
  }
});
    let i = this.randomInt(1,10) ;
    if(i<7){
      this.showRewardVideo();
    }
   this.bd.getMenu().then((res:any)=>{
     if(res!=null) {
        this.settings=res;
        this.player = this.settings.player;
     }
   });
  }

  setLoginStatus(){
    this.fb.getLoginStatus().then(res => {
          if (res.status === "connect") {
              this.type_log=2;
            }
        });
  }

  emitNotLogin(e){
    this.presentToast(e);
  }

  initData(rep){
  if (rep!=null) {
     this.loggedIn = true;
     this.myUser=rep;
     this.users = this.myUser.user_data;
   } else {
           this.logout();
    }
  }

  users: any;
  getUserDetail(userid) {
  this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
    .then(res => {
      let body = {
          fbId:userid,
          user: res
       };
       this.loggedIn = true;
       this.finishLog(body);
    })
    .catch(e => {
      this.logout();
    });
}

async finishLog(body){
 const o = await this.FBAuth.endLFb(body).then((res) => {
      if(res[1]){
        this.users = res[0];
        this.loggedIn = true;
        this.myUser.type_login=1;
        this.myUser.user_data = this.users;
        this.bd.saveUser(this.myUser);
      }else{
        this.loggedIn = false;
        this.presentToast("Server error");
        this.logout();
      }
  }).catch(()=>{
    this.presentToast("Please Check your internet connection.");
  });
}
  login() {
  this.fb.login(['public_profile', 'user_friends', 'email'])
    .then(res => {
      if(res.status === "connected") {
        this.loggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.loggedIn = false;
      }
    }) .catch(e => {
      this.presentToast(e);
    });
}

public getAvatar(url,file=[],i=0) {
 if (url == null) {  url = 'default.png'; }
 return AppConfig.getAvatar(url);
}

test() {
  let body = {
          fbId:"45667887",
          user: { name:"HitBoard Admin ",email:"bmarcella91@gmail.com"}
 };
 this.finishLog(body);
}

logout() {
  this.fb.logout()
    .then( res => {
      this.loggedIn = false;
      this.bd.saveUser(null);
    })
    .catch(e => {
      // to remove
      if(this.DEV){
         this.bd.saveUser(null);
         this.loggedIn = false;
         this.users = {};
       }
      console.log('Error logout from Facebook', e)
  });
}



  isReject(cat){
   return this.checkCat(cat);
  }
  checkCat(f){
    if (this.settings.cats.some( (id_cat) => id_cat === f.id_cat)){
       return true;
    }
    return  false;
  }

 UTF8toStr(s){
 return decodeURIComponent(escape(s));
}
  removeCats(e,cat){
  let r = e.target.checked;
    if(r) {
      this.settings.cats.push(cat.id_cat);
    }else{
    this.settings.cats.forEach( (item, index) => {
       if(item == cat.id_cat) {
         this.settings.cats.splice(index,1);
       }
     });
    }
    this.updateMenu();
    this.refreshDocuments();
  }
  updateMenu(){
    this.player = this.settings.player;
    this.bd.saveMenu(this.settings);
  }
  showCat=false;
  toggleLCat(){
    this.showCat=!this.showCat;
  }

  toggleMenu(){
    this.menu =!this.menu;
  }

   islistening(file){
     if(this.state.media.duration && this.state.info && this.state.info.playing  && this.state.info.id_pub==file.id_pub){
       return true;
     }
     return false;
  }

  ionViewWillLeave(){

  }

  initInfo(){

     this.state.info= {
       avatar_ent:"",
       id_pub:null,
       link_pub :"",
       artist:"",
       title:"Nothing is play",
       playing: false
    };

  }

  ionViewDidEnter() {

  }

 detectBottom() {
   if(this.content.nativeElement.scrollTop == this.content.nativeElement.scrollHeight - this.content.nativeElement.contentHeight){
    console.log("bottom was reached!");
   }
 }
   ionViewWillEnter(){
      this.files=[];
      this.playlist=[];
      this.bd.getMenu().then(menu=> {

      this.store.select('appState').subscribe((value: any) => {
      this.state.media= value.media;
      this.initInfo();
      if(value.info){
          this.state.info = value.info;
       }
    });
     // Updating the Seekbar based on currentTime
      this.store
      .select('appState')
      .pipe(
        pluck('media', 'timeSec'),
        filter(value => value !== undefined),
        map((value: any) => Number.parseInt(value)),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        this.seekbar.setValue(value);
      });

      if(menu !=null  && menu!=""){
         this.settings = menu;
        }
      this.getPlayl();
      this.getDocuments();
      });
   }
   public  keySeachUp(e){
   e=e.target.value;
   this.tlong = false;
   if(e!=""){
  this.timeOutToSearch = setTimeout(()=>{
     let u = 'Bo/@Hb/query/1/';
     this.makeSearch(u,e);
     this.arrange()
    },2000);
    } else{
       this.files=[];
       this.kfile=[];
       this.init();
       this.arrange();
   }
  }
async  addToPlaylist(file){
     const r = await this.bd.addMusic(file).then((res)=> {
       if(res){
         this.playlist.push(file);
         this.presentToast(file.nom+ " add to your playlist.");
       }
    });
 }
 async  makeSearchNext(u,e,event){
   const data = await this.cloudProvider.getQuery(u,e).then(res => {
       this.type_ent = res[1];
       this.newData = res[0];
       this.nextUrl = res[2];
       this.loader=false;
       event.target.complete();
       if(this.newData.length!=0){
       if(this.bsearch){
          this.kfile=[];
          this.addNewMusic();
        }else{
          this.kfile=this.newData;
        }
        }else{
         this.tlong = true;
         this.msgUnload="Nothing found for your search.";
       }
      });
  }

  async  makeSearchNext2(u,e){
    const data = await this.cloudProvider.getQuery(u,e).then(res => {
        this.type_ent = res[1];
        this.newData = res[0];
        this.nextUrl = res[2];
        this.loader=false;
        if(this.newData.length!=0){
        if(this.bsearch){
           this.kfile=[];
           this.addNewMusic();
         }else{
           this.kfile=this.newData;
         }
         }else{
          this.tlong = true;
          this.msgUnload="Nothing found for your search.";
        }
      }).catch(()=>{
        this.loader=false;
      });
   }
 async getPlayl(){
   const data = await this.bd.getAllMusic().then(res => {
       if(res!=null){
       this.playlist = res;
       }
   });
 }


  check(f){
    if(this.playlist.some( (file) => file.id_pub === f.id_pub)){
       return false;
    }
    return true;
  }
 async  makeSearch(u,e){
   const data = await this.cloudProvider.getQuery(u,e).then(res => {
       this.type_ent = res[1];
       this.newData = res[0];
       this.nextUrl = res[2];
       if(this.newData.length!=0){
       if(this.bsearch){
          this.files=[];
          this.kfile=[];
          this.addNewMusic();
        }else{
          this.kfile=this.newData;
        }
        }else{
         this.tlong = true;
         this.msgUnload="Nothing found for your search.";
       }
      });
  }

  public keySeachDown(e){
    if(this.timeOutToSearch!=undefined){
       clearTimeout(this.timeOutToSearch);
       this.timeOutToSearch=undefined;
    }
  }
  toggleSearch() {
    this.bsearch=!this.bsearch;
    if(!this.bsearch){
       this.files= this.hfiles;
       this.nextUrl = this.hnextUrl;
       this.tlong = false;
    } else {
      this.hfiles= this.files;
      this.files = this.kfile;
      this.hnextUrl = this.nextUrl;
      this.nextUrl="";
      this.init();
    }
    this.arrange();
  }

  init(){
      this.tlong=true;
      this.msgUnload="Please enter what you want to search and wait.";
  }

   async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
download(file, index) {
  if(this.loggedIn){
 this.addDL(file.id_pub);
 const n = Number(this.files[index].download) + 1;
 this.files[index].download = n;
 let nom = file.nom;
 this.currentDL = { index, file, nom };
 this.isDL=true;
 let nf = new Date().getUTCDate()+file.nom+".mp3";
 let url = AppConfig.getAudio(file.link_pub);
 this.makeDownload(nf,url);
}else{
  this.presentToast("Please login before download any music");
}
}

cancelDL(){
   this.isDL=false;
   this.fileTransfer.abort();
   this.currentDL = {};
}
makeDownload(fileName, filePath) {
const url = encodeURI(filePath);
try {
this.fileTransfer = this.transfer.create();
const result = this.file.createDir(this.file.externalRootDirectory,'Download', true);
  // statements
result.then((resp) => {
 let  path = resp.toURL();
 path = path+fileName;
 this.fileTransfer.download(url,path , true).then((entry) => {
     this.isDL=false;
     this.currentDL={};
     this.presentToast("File downloaded");
     this.showRewardVideo();
 }).catch((error) => {
     this.isDL=false;
     this.currentDL={};
     this.presentToast("Download failed");
 });
}).catch((error) => {
     this.isDL=false;
     this.currentDL={};
     this.presentToast("Download failed");
 });
} catch(e) {
  this.isDL=false;
  this.currentDL={};
}

}

  getListen(e) {
     e = Number(e);
  	  if (e === 0) {
       return  'New';
    } else  if (e === 1) {
      return 'One listening';
    }  else if (e < 10) {
       return  e + ' listening';
  	} else if (e >= 10) {
       return  '+10L - BRONZE';
  	} else if (e >= 100) {
      return  '+100L - SILVER';
  	} else if (e >= 1000) {
      return  '+1000L - GOLD ';
  	} else if (e >= 1000000) {
       return  'HIT';
  	} else {
  		return  this.setFormat(e) + ' listening';
  	}

  }

   getDL(e) {
     e = Number(e);
     if (e === 0) {
       return  'No download';
      } else  if (e === 1) {
      return 'One Download';
     } else {
      return  this.setFormat(e) + ' Download';
    }
  }

setFormat(e){
  if(e<1000){
    return e+"";
  }else if (e>=1000 && e<999999){
      return Math.ceil((e/1000))+"K";
  } else if (e>=1000000 && e<999999999){
      return Math.ceil((e/1000000))+"M";
  }else{
         return "~";
  }
}
async  addView(id) {
	 const data = await this.cloudProvider.addView('Bo/@Hb/addView/' + id).then(res => {
      });
}

async  addDL(id) {
   const data = await this.cloudProvider.addView('Bo/@Hb/addDL/' + id).then(res => {
      });
}

async  doRefresh(event) {
    if ( this.nextUrl !== '') {
    if(!this.bsearch){
      const data = await this.cloudProvider.getFiles(this.nextUrl).then(res => {
        this.newData = res[0];
        this.type_ent = res[1];
        this.nextUrl = res[2];
        // tslint:disable-next-line:prefer-for-of
        this.addNewMusic();
        event.target.complete();
      });
     }else{
        this.makeSearchNext(this.nextUrl,this.query,event);
     }
    } else {
      event.target.complete();
    }
  }

  async  loadData(event) {
    this.doRefresh(event);
 }

  addNewMusic() {
  	 for (let i = 0; i < this.newData.length; i++) {
          if(this.isMusic(this.newData[i])){
            this.files.push(this.newData[i]);
           }
        }
    if(this.state.playing){
          this.arrange();
        }
   }
   isMusic(f){
    if(this.files.some( (file) => file.id_pub === f.id_pub)){
       return false;
    }
    return true;
  }

  log(t) {
    // console.log(t);
  }

  formatUrl(){
    let param ="1|";
    let n = this.settings.cats;
    let rep = n.join(",");
    param += rep;
    return 'Bo/@Hb/listPub/'+param+'/';
  }
   async getDocuments() {
     this.setLong("Please check your internet connection.");
     if (this.files.length === 0) {
       const data = await this.cloudProvider.getFiles(this.formatUrl()).then(res => {
       this.type_ent = res[1];
       this.newData = res[0];
       this.nextUrl = res[2];
       this.cats = res [3];
       clearTimeout(this.timeOutLoad);
       this.tlong = false;
       this.timeOutLoad=undefined;
       if(this.newData.length!=0){
       this.addNewMusic();
       }else{
         this.setMsg("No Music found,\n Please check your configuration.\n");
       }
      });
    }
   }

    async refreshDocuments() {
       this.setLong("Please check your internet connection.");
       this.files=[];
       const data = await this.cloudProvider.getFiles(this.formatUrl()).then(res => {
       clearTimeout(this.timeOutLoad);
       this.type_ent = res[1];
       this.newData = res[0];
       this.nextUrl = res[2];
       this.cats = res [3];
       this.tlong = false;
       this.timeOutLoad=undefined;
       if(this.newData.length!=0){
       this.addNewMusic();
       }else{
         this.setMsg("No Music found,\n Please check your configuration\n");
       }
      });
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

   ionViewDidLoad() {
       this.admobFreeService.BannerAd();
   }

  ionViewWillLoad() {
   //this.admobFreeService.BannerAd();
  }


  openFile(file, index) {
  	// tslint:disable-next-line:indent
  this.addView(file.id_pub);
  const media = {
      avatar_ent:file.avatar_ent,
      id_pub: file.id_pub,
      link_pub : file.link_pub,
      artist: file.nom_ent,
      title: file.nom,
      playing: true
    };
  const n = Number(this.files[index].get_access) + 1;
  this.files[index].get_access = n;
  this.playStream(media,index);
  this.showInterstitial();
  }

  setupControl(f,dir=0){
 this.musicControls.create({
  track       : f.title,        // optional, default : ''
  artist      : f.artist,                       // optional, default : ''
  cover       :this.getAvatar(f.avatar_ent),      // optional, default : nothing
  // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
  //           or a remote url ('http://...', 'https://...', 'ftp://...')
  isPlaying   : true,                         // optional, default : true
  dismissable : true,                         // optional, default : false
  // hide previous/next/close buttons:
  hasPrev   : false,      // show previous button, optional, default: true
  hasNext   : false,      // show next button, optional, default: true
  hasClose  : true,       // show close button, optional, default: false
  // iOS only, optional
  album       : 'Absolution',     // optional, default: ''
  duration :0, // optional, default: 0
  elapsed : 10, // optional, default: 0
  hasSkipForward : true,  // show skip forward button, optional, default: false
  hasSkipBackward : true, // show skip backward button, optional, default: false
  skipForwardInterval: 15, // display number for skip forward, optional, default: 0
  skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
  hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

  // Android only, optional
  // text displayed in the status bar when the notification (and the ticker) are updated, optional
  ticker    : 'Now playing "'+f.title+'"',
  // All icons default to their built-in android equivalents
  playIcon: 'media_play',
  pauseIcon: 'media_pause',
  prevIcon: 'media_prev',
  nextIcon: 'media_next',
  closeIcon: 'media_close',
  notificationIcon: 'notification'
 });
 this.musicControls.subscribe().subscribe(action => {
      this.events(action);
   });
   this.musicControls.listen(); // activates the observable above
}

  events(action){
    const message = JSON.parse(action).message;
        switch(message) {
            case 'music-controls-next':
                //this.musicControls.destroy();
                //this.next();
                break;
            case 'music-controls-previous':
               //this.musicControls.destroy();
               //this.previous();
                break;
            case 'music-controls-pause':
                this.pause();
                break;
            case 'music-controls-play':
                this.play();
                break;
            case 'music-controls-destroy':
                this.stop();
                break;
        // External controls (iOS only)
        case 'music-controls-toggle-play-pause' :
                // Do something
           break;
        case 'music-controls-seek-to':
          const seekToInSeconds = JSON.parse(action).position;
          this.musicControls.updateElapsed({
            elapsed: seekToInSeconds,
            isPlaying: true
          });
            this.onSeekEndNew(seekToInSeconds);
          break;
        case 'music-controls-skip-forward':
          // Do something
          break;
          case 'music-controls-skip-backward':
          // Do something
          break;
            // Headset events (Android only)
            // All media button events are listed below
            case 'music-controls-media-button' :
                // Do something
                break;
            case 'music-controls-headset-unplugged':
                this.pause();
                // Do something
                break;
            case 'music-controls-headset-plugged':
                // Do something
                break;
            default:
                break;
        }

  }

 resetState() {
    this.musicControls.destroy();
    this.audioProvider.stop();
    this.store.dispatch({ type: RESET });
  }
   playStream(media, index) {
    let file = media;
    this.resetState();
    this.setupControl(media,0);
    this.state.info=media;
    this.player = this.settings.player;
    this.audioProvider.playStream(file).subscribe( event => {
      const audioObj = event.target;
      switch (event.type) {
        case 'canplay':
          this.currentFile = { index,media, state: 2 };
          return this.store.dispatch({ type: CANPLAY, payload: { value: true,mediaInfo:file } });
         case 'loadedmetadata':
          return this.store.dispatch({
            type: LOADEDMETADATA,
            payload: {
              mediaInfo:file,
              value: true,
              data: {
                time: this.audioProvider.formatTime(
                       audioObj.currentTime * 1000,
                     'HH:mm:ss'
                ),
                timeSec: audioObj.duration,
                mediaType: 'mp3'
              }
            }
          });

        case 'playing':
        this.musicControls.updateIsPlaying(true);
        return this.store.dispatch({ type: PLAYING, payload: { value: true } });
        case 'pause':
        this.musicControls.updateIsPlaying(false);
        return this.store.dispatch({ type: PLAYING, payload: { value: false } });
        case 'timeupdate':
         this.chechToplayNext(audioObj.currentTime,audioObj.duration);
         this.musicState.size = this.audioProvider.formatTime(
            audioObj.duration * 1000,
            'HH:mm:ss'
          );
         this.musicState.time = this.audioProvider.formatTime(audioObj.currentTime * 1000, 'HH:mm:ss');
         return this.store.dispatch({
            type: TIMEUPDATE,
            payload: {
              timeSec: audioObj.currentTime,
              time: this.audioProvider.formatTime(
                audioObj.currentTime * 1000,
                'HH:mm:ss'
              )
            }
          });
        case 'loadstart':
          return this.store.dispatch({ type: LOADSTART, payload: { value: true, mediaInfo:file} });
      }
    });
  }

  player: boolean = true;

  async togglePlayer(e){
     if(this.player){
        this.animateHide(e,'flipOutX').then(()=>{
        this.player = !this.player;
       });
     } else {
            this.player = await !this.player;
            this.animateShow(e,'bounceIn').then(()=>{
       });
     }
   }

   emitAnimate(e){
      this.animator.setType(e.anim).show(e.el).then(()=>{});
   }
  animateHide(l,e) {
    return this.animator.setType(e).hide(l);
  }
  animateShow(l,e) {
    return this.animator.setType(e).show(l);
  }
   pause() {
    this.audioProvider.pause();
    this.currentFile.state = 1;
    this.state.info.playing=false;
  }


  play() {
   if(this.state.info.playing){
      this.pause();
    }
   this.audioProvider.play();
   this.currentFile.state = 2;
  }

   stop() {
    this.reset();
    this.audioProvider.stop();
    this.currentFile={};
    this.state.media ={};
    this.initInfo();
  }
  getH(h){
   if(h!=null){
   let m =h.split(":");
   let n="";
   if(m[0]!="00"){
     n=m[0]+":";
   }
   n+=m[1]+":"+m[2];
   return n;
   }
   return "";
  }
  chechToplayNext(ta,tb){
     if(this.settings.automatic && ta==tb){
       this.next();
     }
  }
 next() {
   if (this.currentFile.index!=null && this.currentFile.index < this.files.length - 1) {
    let  index = this.currentFile.index + 1;
    index = this.getNext(index);
    const file = this.files[index];
    this.openFile(file, index);
   }
  }
  previous() {
    if (this.currentFile.index!=null && this.currentFile.index > 0) {
    // tslint:disable-next-line:prefer-const
    let index = this.currentFile.index - 1;
    index = this.getNext(index);
    // tslint:disable-next-line:prefer-const
    let file = this.files[index];
    this.openFile(file, index);
    }
  }

  getNext(index){
    if(this.settings.randomly){
     return this.randomInt(0,(this.files.length-1));
    }
    return index;
  }

   onSeekStart() {
    this.onSeekState = this.state.info.playing;
    if (this.onSeekState) {
        this.pause();
       }
  }

  onSeekEnd(event) {
    if (this.onSeekState) {
      this.audioProvider.seekTo(event.target.value);
      this.play();
     } else {
      this.audioProvider.seekTo(event.target.value);
    }
  }

  onSeekEndNew(event) {
    if (this.onSeekState) {
      this.audioProvider.seekTo(event);
      this.play();
     } else {
      this.audioProvider.seekTo(event);
    }
  }

  ionViewWillUnload() {
    this.stop();
    this.currentFile={};
  }


  reset() {
    this.resetState();
    this.currentFile = {};
    this.displayFooter = 'inactive';
  }


   arrange() {
     let is=false;
     if(this.currentFile.media) {
     for (let i = 0; i < this.files.length; i++) {
          if(this.files[i].id_pub===this.currentFile.media.id_pub){
            is = true;
            this.currentFile.index=i;
            break;
          } else { continue; }
        }
      }
     if (!is) {
         this.currentFile.index = null;
      }
  }

}
