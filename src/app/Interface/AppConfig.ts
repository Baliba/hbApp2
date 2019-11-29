
import { Headers } from '@angular/http';
export class AppConfig {
    //
     //static  domain: string ="http://192.168.43.103"; static  folder: string = "/HbApp/";
    static  domain: string ="http://127.0.0.1"; static  folder: string = "/HbApp/";
   //static  domain: string ="http://192.168.1.197";static  folder: string = "/HbApp/";
   //static  domain: string ="http://192.168.0.198";static  folder: string = "/HbApp/";
   //static  domain: string ="http://hitboard.histpro.com"; static  folder: string = "/";
   static audio:string = "hb_data/audio/";
   static img: string = "hb_data/img/";
   static avatar: string = "globalImg/User_img/hb/";
   static video: string = "hb_data/video";
   //tslint:disable-next-line:align
   static DEV = false;
   static  getUrl(param:string) : string{
         let url = this.domain + this.folder + param;
         this.log(url);
         return url;
    }
     static log(t) {
          if (this.DEV)
          console.log(t);
     }
     static getAudio(param: string): string {
         let u= this.domain + this.folder +this.audio+param;
         this.log(u);
          return u;
     }

     static getImg(param: string): string {
          let u = this.domain + this.folder + this.img + param;
         // this.log(u);
          return u;
     }
     static getAvatar(param: string): string {
          let u = this.domain + this.folder + this.avatar + param;
         // this.log(u);
          return u;
     }

     static getHeaders(post = false): Headers {
          const headers = new Headers();
          headers.append('Accept', 'application/json;charset=UTF-8');
          headers.append('apikey', 'a0gtfzuX99GqHrmBoCPK3EOil');
          if (post) { headers.append('Content-Type', 'application/x-www-form-urlencoded'); }
          return headers;
     }
}
