import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { reject } from 'q';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor() { }

  // callback
  getCallBackData(callback){
    setTimeout(()=>{
      var list = [
        {method:'callback'},
        {name:'lixing'},
        {age:20}
      ]
      callback(list)
    },3000)
  }

  //promise
  getPromiseData(){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        var list = [
          {method:'Promise'},
          {name:'lixing'},
          {age:20}
        ]
        resolve(list)
      },3000)
    })
  }

  //rxjs
  getRxjsData(){
    return new Observable(observer=>{
      setTimeout(()=>{
        var list = [
          {method:'rxjs'},
          {name:'lixing'},
          {age:20}
        ]
        observer.next(list)
      },3000)
    })
  }
  //rxjs 数据推送
  getRxjsPushData(){
    return new Observable(observer=>{
      var count = 0
      setInterval(()=>{
        count++;
        var list = [
          {method:'rxjs---'+count},
          {name:'lixing'},
          {age:20}
        ]
        observer.next(list)
      },3000)
    })
  }
}
