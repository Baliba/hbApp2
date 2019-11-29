import { Http } from '@angular/http';
import { AppConfig } from '../Interface/AppConfig';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable({
  providedIn: 'root'
})
export class GetAudioService {
  // tslint:disable-next-line: deprecation
  dev = true;
  constructor(private http: Http) {
  }
   log(t) {
      // console.log(t);
  }
  map(data){
      this.data = data.json();
      if(!this.data.crash){
           if(this.data!=undefined && this.data!=null) {
           let type_ent = this.data.body.data.type_entite;
           let next ="";
           let pub = []
           let cats=[];
           //@pub configs
           if(this.data.body.data.pubs) {
             pub=this.data.body.data.pubs.Publication
             next = this.data.body.data.pubs.next_page;
           }
           //@cats config
           if(this.data.body.data.cats){
             cats = this.data.body.data.cats;
           }
           //@new settings
           let news =[];
           if(this.data.body.data.news){
               news = this.data.body.data.news.Publication;
               next = this.data.body.data.news.next_page;
           }
           return  [pub,type_ent,next,cats,news];
         }
       }else{
         this.log(this.data.message);
       }
        return [[],[],"",[],[]];
  }
   getQuery(url,query) {
    return new Promise(resolve => {
      this.http.post(AppConfig.getUrl(url),{query:query},{
          headers: AppConfig.getHeaders(true)
        })
        //.map(res => {res.json()})
        .subscribe(
          data => {
             resolve(this.map(data));
          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
    });
  }
  data : any={
      crash:true,
      message:"",
      body:{
        data:{
          type_entite : [],
          cats:[],
          news:{
          next_page : "",
          Publication:[]
          },
          pubs:{
            next_page : "",
            Publication:[]
          }
        }
      }
  };
  getFiles(url) {
    return new Promise(resolve => {
      this.http.get(AppConfig.getUrl(url), {
          headers: AppConfig.getHeaders()
        })
       // .map(res => {res.json()})
        .subscribe(
          data => {
             resolve(this.map(data));
          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
    });
  }

  addView(url) {
    return new Promise(resolve => {
      this.http.get(AppConfig.getUrl(url), {
        headers: AppConfig.getHeaders()
      })
        .map(res => res.json())
        .subscribe(
          data => {

            data = data.body.data;
            resolve(data);
          },
          err => {
            console.log("ERROR!: ", err);
          }
        );
    });
  }
  comment : any={
      crash:true,
      message:"",
      body:{
        data:{
          type_entite : [],
          comments:[],
        }
      }
  };
  mapComment(data){

      this.comment = data.json();
      this.log(data._body);
      if(!this.comment.crash){
           if(this.comment!=undefined && this.comment!=null) {
           let type_ent = this.comment.body.data.type_entite;
           let comments = this.comment.body.data.comments;
             return [comments,type_ent];
         }
       }else{
         this.log(this.comment.message);
       }
        return [[],[]];

  }

  sendComment(body){
    return new Promise(resolve => {
      this.http.post(AppConfig.getUrl("Bo/@Hb/addComment"), body, {
        headers: AppConfig.getHeaders(true)
      }).subscribe(
        data => {
          resolve(this.mapComment(data));
        },
        err => {
          console.log("ERROR!: ", err);
        }
      );
    });
  }
   loadComment(body){
    return new Promise(resolve => {
      let u= AppConfig.getUrl("Bo/@Hb/loadComment/"+body);
      this.http.get(u, {
        headers: AppConfig.getHeaders(true)
      }).subscribe(
        data => {
          resolve(this.mapComment(data));
        },
        err => {
          console.log("ERROR!: ", err);
        }
      );
    });
  }
}
