import { PlayerComponent } from './../player/player.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { IonicImageLoader } from 'ionic-image-loader';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@NgModule({
    declarations:[
      PlayerComponent,
      CommentComponent
    ],
  entryComponents: [PlayerComponent, CommentComponent],
  exports: [PlayerComponent, CommentComponent],
   imports: [
     CommonModule,
     IonicModule,
     FormsModule,
     ReactiveFormsModule,
     IonicImageLoader,
     NgxEmojiPickerModule.forRoot(),
  ],
  providers: [SocialSharing],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentModule { }
