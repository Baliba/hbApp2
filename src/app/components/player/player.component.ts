import { Component, OnInit, ViewChild, ElementRef,Input,Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppConfig } from 'src/app/Interface/AppConfig';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
   @ViewChild('inputboxplayer',{read:ElementRef, static:false})  input: ElementRef;
    @Input()
    currentFile : any = {};
    @Input()
    state : any = {};

    @Input()
    player=true;

    @Input()
    seekbar: FormControl = new FormControl('seekbar');

    @Output()
    emitTogglePlayer : EventEmitter<any> = new EventEmitter<any>();

    @Output()
  emitStop : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitPrevious:  EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitNext : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitPause: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitPlay : EventEmitter<any> = new EventEmitter<any>();

   @Output()
   emitAnimate : EventEmitter<any> = new EventEmitter<any>();

   @Output()
   emitOnSeekStart  : EventEmitter<any> = new EventEmitter<any>();

   @Output()
   emitOnSeekEnd  : EventEmitter<any> = new EventEmitter<any>();

  constructor(private share: SocialSharing) {
  }

  public getAvatar(url) {
   if (url == null) {
        url = 'default.png';
    }
   return AppConfig.getAvatar(url);
  }

  ngOnInit() {}

  togglePlayer(){
  	 let i= setInterval(()=>{
  	  if(this.player){
          	this.emitTogglePlayer.emit(this.input.nativeElement);
     } else {
             this.emitTogglePlayer.emit(this.input.nativeElement);
     }
       clearInterval(i);
    },200);
  }

  stop(){
  	this.emitStop.emit();
  }

  next(){
  	this.emitNext.emit();
  }
  previous(){
  	this.emitPrevious.emit();
  }

  play(){
  	this.emitPlay.emit();
  }
  pause(){
  	this.emitPause.emit();
  }

  onSeekStart(){
     this.emitOnSeekStart.emit();
  }

  onSeekEnd(event) {
    this.emitOnSeekEnd.emit(event);
  }
  bwhats=true;
  shareWA(){
    if(this.bwhats){
    this.bwhats=false;
    let file= this.state.info;

    let msg = "I invite you to come listening the music of "+file.artist+" \" "+this.state.info.title+"\" on Hitboard now.\n";
    let img = (file.avatar_ent==null || file.avatar_ent=="") ? AppConfig.getAvatar("default.png") : AppConfig.getAvatar(file.avatar_ent);
    this.share.shareViaWhatsApp(msg,img,"https://play.google.com/store/apps/details?id=com.histpro.hitboard").
    then(()=>{
     this.bwhats=true;
    }).catch((err)=>{
      this.bwhats=true;
     });
   }
  }
}
