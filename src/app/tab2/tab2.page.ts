
import { Component, ViewChild, Injectable, Inject  } from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import { NavController,  LoadingController, ToastController} from '@ionic/angular';
import { AudioService } from '../services/audio.service';
import {FormControl} from '@angular/forms';
import {CANPLAY, LOADEDMETADATA, PLAYING, TIMEUPDATE, LOADSTART, RESET} from '../Interface/MediaAction';
import {Store} from '@ngrx/store';
import { GetAudioService } from '../services/get-audio.service';
import {pluck, filter, map, distinctUntilChanged} from 'rxjs/operators';
import { AppConfig } from '../Interface/AppConfig';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AdMobService } from '../services/ad-mob.service';
import { PlaylistService } from '../providers/playlist.service';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
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
export class Tab2Page {
  defaultImage: string = "assets/icon.png";
  files: any = [];
  hfiles: any = [];
  seekbar: FormControl = new FormControl('seekbar');
  state: any = {};
  onSeekState: boolean;
  currentFile: any = {};
  currentDL: any = {};
  displayFooter = 'inactive';
  loggedIn: Boolean;
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
  query:string = "";
  tlong=false;
  msgUnload;
  kfile=[];
  isDL=false;
  playlist : any=[];
  settings:any = {
    automatic:false,
    showImage:true,
    randomly:false,
    statistic:true,
    autoplay:false,
    cats:[],
    player:true
  }
  myUser = {
        type_login:1,
        user_data:{},
    };

  loader=false;
  users:any;
  DEV=true;
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
   @Inject(AnimationService)  animationService: AnimationService,
   @Inject(MusicControls) private musicControls: MusicControls,
   private store: Store<any>
  ) {
    this.animator = animationService.builder();
    let i = this.randomInt(1,30) ;
    if(i<15){
      this.showRewardVideo();
    }
   this.bd.getMenu().then((res:any)=>{
     if(res!=null) {
        this.settings=res;
        this.player=this.settings.player;
     }
   });
  }


   public  keySeachUp(e) {
    if(this.query!=""){
     this.files = this.filterItems(this.query);
     if(this.files.length==0){
       this.setMsg("Nothing found.");
     }
    }else{
      this.files = this.hfiles;
    }
     this.arrange();
  }

  filterItems(searchTerm) {
    return this.files.filter(item => {
      return item.nom.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

 async  removeFromPlaylist(file){
     const r = await this.bd.removeMusic(file).then((res)=> {
         this.files=[];
         if(res!=null){
          this.files = res;
         }
         if(this.files.length==0){
            this.setMsg("Your playlist is empty.");
         }
         this.presentToast(file.nom+ " remove from playlist.");
    });
 }
  async getPlayl() {
   const data = await this.bd.getAllMusic().then(res => {
       if(res !=null){
       this.files = res;
       this.autoplay();
       this.arrange();
       }else{
         this.setMsg("Your playlist is empty, slide item to left to add music in your playlist.");
       }
   });
 }

   setMsg(e){
       this.tlong = true;
       this.msgUnload=e;
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

  toggleSearch() {
    this.bsearch=!this.bsearch;
    if(this.bsearch){
      this.hfiles = this.files;
    }else{
      this.files=this.hfiles;
      this.arrange();
    }
  }

  arrange(){
     if(this.currentFile.media){
     for (let i = 0; i < this.files.length; i++) {
          if(this.files[i].id_pub===this.currentFile.media.id_pub){
              this.currentFile.index=i;
            break;
          }else{ continue;}
        }
      }
  }

   async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
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

  addNewMusic() {
  	 for (let i = 0; i < this.newData.length; i++) {
          this.files.unshift(this.newData[i]);
        }
  }

  public getAvatar(url, file, index) {
   if (url == null) {
        url = 'default.png';
    }
   return AppConfig.getAvatar(url);
  }

  log(t) {
     console.log(t);
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
  ionViewWillUnload() {
    this.stop();
    this.currentFile={};
  }

  initInfo(){

     this.state.info= {
       id_pub:null,
       link_pub :"",
       artist:"",
       title:"Nothing is play",
       playing: false
    };

  }
   ionViewWillEnter(){

     this.store.select('appState').subscribe((value: any) => {
     this.state.media = value.media;
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
     this.bd.getMenu().then(res=>{
        this.getPlayl();
         if(res!=null) {
          this.settings = res;
          this.player = this.settings.player;
         }
     });

   }


  openFile(file, index) {
  	// tslint:disable-next-line:indent
  	this.addView(file.id_pub);
   const media = {
      id_pub:file.id_pub,
      link_pub : file.link_pub,
      artist: file.nom_ent,
      title: file.nom,
      playing: true
    };
   const n = Number(this.files[index].get_access) + 1;
   this.files[index].get_access = n;
   this.playStream(media,index);
   let i = this.randomInt(1, 10);
   if (i < 8) {
      this.showInterstitial();
    }
  }
   resetState() {
    this.audioProvider.stop();
    this.store.dispatch({ type: RESET });
    this.musicControls.destroy();
  }
   islistening(file){
     if(this.state.media.duration &&  this.state.info && this.state.info.playing  && this.state.info.id_pub==file.id_pub){
       return true;
     }
     return false;
  }

  setupControl(f,dir=0){
  this.musicControls.create({
  track       : f.title,        // optional, default : ''
  artist      : f.artist,                       // optional, default : ''
  cover       :this.getAvatar(f.avatar_ent,null,0),      // optional, default : nothing
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

  onSeekEndNew(event) {
    if (this.onSeekState) {
      this.audioProvider.seekTo(event);
      this.play();
     } else {
      this.audioProvider.seekTo(event);
    }
  }
     playStream(media, index) {
    let file = media;
    this.resetState();
    this.setupControl(media,0);
    this.state.info=media;
    this.player=this.settings.player;
    this.audioProvider.playStream(file).subscribe( event => {
      const audioObj = event.target;
      switch (event.type) {
        case 'canplay':
          this.currentFile = { index, media, state: 2 };
          return this.store.dispatch({ type: CANPLAY, payload: { value: true,mediaInfo:file } });
        case 'loadedmetadata':
          return this.store.dispatch({
            type: LOADEDMETADATA,
            payload: {
              mediaInfo:file,
              value: true,
              data: {
                time: this.audioProvider.formatTime(
                  audioObj.duration * 1000,
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
          this.log("LOADSTART IS CALL");
          return this.store.dispatch({ type: LOADSTART, payload: { value: true, mediaInfo:file} });
      }
    });
  }

   pause() {
    this.audioProvider.pause();
    this.currentFile.state = 1;
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
   if (this.currentFile.index < this.files.length - 1) {
    let  index = this.currentFile.index + 1;
    index = this.getNext(index);
    const file = this.files[index];
    this.openFile(file, index);
   }
  }
  previous() {
    if (this.currentFile.index > 0) {
          // tslint:disable-next-line:prefer-const
    let index = this.currentFile.index - 1;
    index = this.getNext(index);
    // tslint:disable-next-line:prefer-const
    let file = this.files[index];
    this.openFile(file, index);
    }
  }

   autoplay(){
    if(this.settings.autoplay && !this.currentFile.media){
     let index = this.randomInt(0,this.files.length-1);
     let f= this.files[index];
     if(f!=null){
       this.openFile(f,index);
      }
    }
  }

  ionViewDidLoad() {
     this.admobFreeService.BannerAd();
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


  reset() {
    this.resetState();
    this.currentFile = {};
    this.displayFooter = 'inactive';
  }

}
