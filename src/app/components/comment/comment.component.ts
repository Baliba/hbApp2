
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import { GetAudioService } from 'src/app/get-audio.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
 /* queries: {
    content: new ViewChild('content')
  }*/
})
export class CommentComponent implements OnInit {
   @ViewChild('myElm2', {read: ElementRef, static: false}) pElem: ElementRef;
   @ViewChild('inputbox', {read: ElementRef, static: false}) minput: ElementRef;
   @ViewChild('inputbox', {read: ElementRef, static: true})  input: ElementRef;
  message: any = '';
  toggled = false;

  @Input()
  comments: any = {};

   @Input()
   users: any = {};
    @Input()
    ncom: any = 1;

   @Input()
   id_pub: any = {};

  @Input()
   isLogin: any = {};

  @Output()
  emitNotLogin: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitAnimate: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  emitLogin: EventEmitter<any> = new EventEmitter<any>();

  defaultImage = 'assets/icon.png';

  send = true;

  allComment = false;
  mComment = true;
  aComment = false;
  isSend=false;
  constructor(private req: GetAudioService,public alertController: AlertController) {

  }

  async presentAlertConfirm() {
   const alert = await this.alertController.create({
     header: 'Please Login before adding a comment',
     message: 'Do want to login now with your facebook account?',
     buttons: [
       {
         text: 'No',
         role: 'cancel',
         cssClass: 'secondary',
         handler: (blah) => {
           alert.dismiss();
         }
       }, {
         text: 'Yes',
         handler: () => {
           alert.dismiss();
           this.login();
         }
       }
     ]
   });

   await alert.present();
 }

 public login() {
    this.emitLogin.emit();
  }
  formatTime(time) {
    return moment(time, "YYYY-MM-DD hh:mm:ss").fromNow();
  }

  setFormat(e) {
  if (e < 1000) {
    return e + '';
  } else if (e >= 1000 && e < 999999) {
      return Math.ceil((e / 1000)) + 'K';
  } else if (e >= 1000000 && e < 999999999) {
      return Math.ceil((e / 1000000)) + 'M';
  } else {
         return '~';
  }
  }
  ngOnInit() {}

  public broadcastNotLogin(): void {
     this.presentAlertConfirm();
  }

   public emitMessage(e): void {
     this.emitNotLogin.emit(e);
  }

   public animpanel() {
    this.allComment = false;
  }

  public animInputIn() {
     this.emitAnimate.emit({el: this.input.nativeElement, anim: 'bounceIn'});
  }

 async  animInputOut() {
   this.emitAnimate.emit({el: this.minput.nativeElement, anim: 'bounceOut'});
   const i = setInterval(() => {
       this.aComment = false;
       this.message = '';
       clearInterval(i);
    }, 1100);

   }

   sendComment() {
   this.send = false;
   this.isSend=true;
   const body = {
      id_user: this.users.id_entite,
      id_ent: this.id_pub,
      text: this.message,
    };
   this.req.sendComment(body).then((data) => {
      this.send = true;
       this.isSend=false;
      this.emitMessage('comment saved');
      this.message = '';
      this.addNewComment(data[0]);
    }).catch((e) => {
       this.send = true;
       this.isSend=false;
       this.emitMessage(e);
    });

   }

   async loadComment() {
     if (this.comments.next_page !== '' && this.comments.next_page != null) {
     this.mComment = false;
     const page = this.comments.next_page.split('=')[1];
     const body = page + '/' + this.id_pub + '/';
     const rep = await this.req.loadComment(body).then((data) => {
      this.mComment = true;
      this.setUpComments(data[0]);
      this.addNewCommentToEnd(data[0].commenthb);

     }).catch((e) => {
       this.emitMessage(e);
    });
   } else {
       this.emitMessage('no more comments');
   }
   }
   setUpComments(data) {
   console.log(data.next_page);
   this.comments.next_page = (data.next_page !== '') ? 'page=' + data.next_page : null;
   this.comments.prev_page = (data.next_page !== '') ? 'page=' + data.prev_page : null;
   if (this.comments.current_page !== data.current_page) {
   this.comments.current_page = data.current_page;
   }
   }

   addNewComment(data) {
     // tslint:disable-next-line:prefer-for-of
     for (let i = 0; i < data.length; i++) {
            this.comments.Commenthb.push(data[i]);
            this.ncom++;
      }
   }
   addNewCommentToEnd(data) {
     // tslint:disable-next-line: prefer-for-of
     for (let i = 0; i < data.length; i++) {
            this.comments.Commenthb.push(data[i]);
      }
   }
  setComment() {
  if (this.send) {
   if (this.isLogin) {
    this.sendComment();
   } else {
     this.broadcastNotLogin();
    }
   }
  }

  handleSelection(event) {
  this.message += event.char;
  }

}
