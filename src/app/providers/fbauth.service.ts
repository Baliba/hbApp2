import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Http } from '@angular/http';
import { AppConfig } from '../Interface/AppConfig';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class FBAuthService {

  constructor(private fb: Facebook,private http: Http) {
  }

   data : any = {
      crash:true,
      message:"",
      body:{
        data:{
          user :null,
          isKo:""
        }
      }
  };

   map(data){
      this.data = data.json();
      if(!this.data.crash){
           if(this.data!=undefined && this.data!=null){
           let user = this.data.body.data.user;
           let isOk = this.data.body.data.isOk;
           return  [user,isOk,""];
         }
       }else{
       	 return  [null,false,this.data.message];
       }
        return [null,false,""];
  }

   endLFb(body){
      let url = AppConfig.getUrl("Bo/@Hb/loginFB");
      return new Promise(resolve => {
      this.http.post(url, body,{
          headers: AppConfig.getHeaders(true)
         }).subscribe(
          data => {
             resolve(this.map(data));
          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
      });
    }

   loginFB() {
   return  this.fb.login(['public_profile', 'user_friends', 'email']);
   }

  stepFBA(userid){
   return  this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"]);
  }


}
