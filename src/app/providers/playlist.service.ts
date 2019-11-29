import { Injectable, Inject } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  LIST_MUSIC="LIST_MUSIC";
  MENU_SETTING="MENU_SETTING";
  USER="USER";
  MUSIC: any=[];
  constructor( private bd: Storage) {

  }

  log(e){
    console.log(e);
  }

  addMusic(file){
  	return new Promise(resolve => {
  	this.getAllMusic().then(res=>{
         this.MUSIC = res;
         if(this.MUSIC==null){
            this.MUSIC=[];
         }

         if(this.check(file)) {
           this.MUSIC.push(file);
           this.save().then(()=> {
             resolve(true);
           });
          }else{
            resolve (false);
         }
  	});
    });
  }

  removeMusic(m){
    return new Promise(resolve => {
     this.getAllMusic().then(res=>{
     this.MUSIC=res;
     this.MUSIC.forEach( (item, index) => {
       if(item.id_pub === m.id_pub) {
         this.MUSIC.splice(index,1);
          this.save().then(()=>{
            resolve(this.MUSIC);
          });
       }
     });
     });
   });
  }

  getAllMusic(){
  	  return new Promise(resolve => {
            this.bd.get(this.LIST_MUSIC).then((res) => {
                res = JSON.parse(res);
                resolve(res);
              });
    });
  }
  save(){
   return this.bd.set(this.LIST_MUSIC,JSON.stringify(this.MUSIC));
  }

   check(f){
    if(this.MUSIC.some( (file) => file.id_pub === f.id_pub)){
       return false;
    }
    return true;
  }

  saveUser(val){
   return this.saveJSON(this.USER,val);
  }

  getUser(){
    return this.getJSON(this.USER);
  }

  saveMenu(val){
   return this.saveJSON(this.MENU_SETTING,val);
  }
  getMenu(){
    return this.getJSON(this.MENU_SETTING);
  }

  saveJSON(name,val){
    return this.bd.set(name,JSON.stringify(val));
  }

  getJSON(data){
      return new Promise(resolve => {
            this.bd.get(data).then((res) => {
                res = JSON.parse(res);
                resolve(res);
              });
    });
  }
  saveDATA(name,val) {
    return this.bd.set(name,val);
  }
  getDATA(data){
      return new Promise(resolve => {
            this.bd.get(data).then((res) => {
                resolve(res);
              });
    });
  }

}
