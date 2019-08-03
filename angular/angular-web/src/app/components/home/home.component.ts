import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../common/services/http.service'
import { filter, map} from 'rxjs/operators'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  callbackData: any
  promiseData: any
  rxjsData: any
  filteRxjsData: any
  mapRxjsData: any
  pushRxjsData: any
  promiseRxjsDiffrentData:any = [
    {diff:'使用前处理',promise:'直接使用,不需引用第三方库',rxjs:"import { Observable } from 'rxjs'"},
    {diff:'实例化key值不同',promise:'new Promise()',rxjs:'new Observable()'},
    {diff:'参数',promise:'resolve',rxjs:'observer'},
    {diff:'请求后返回方式',promise:'resolve(data)',rxjs:'observer.next(data)'},
    {diff:'调用时接收结果',promise:'.then(res=>{})',rxjs:'.subscrible(res=>{})'},
    {diff:'是否支持setInterval，多次获取数据',promise:'不支持(调用一次，获取一次数据)',rxjs:'支持(调用一次，获取多次数据，类似信息推送)'},
    {diff:'函数',promise:'/',rxjs:'filter/map'},
  ]

  constructor(private httpService: HttpService) { 
    this.httpService.getCallBackData((res)=>{
      console.log(res)
    })
  }
 
  ngOnInit() {
  }
  getcallback(){
    this.httpService.getCallBackData(res=>{
      console.log(res)
      this.callbackData = res;
    })
  }

  getPromise(){
    this.httpService.getPromiseData().then(res=>{
      this.promiseData = res;
    })
  }

  getRxjs(){
    this.httpService.getRxjsData().subscribe(res=>{
      this.rxjsData = res;
    })
  }
// filter数据
  getFilterRxjs(){
    this.httpService.getRxjsData()
    .pipe(
      filter(value=>{
        value.forEach(element => {
          if(element['method']){
            element['method'] = element['method']+" filter"
          }
         });
        return value
      })
    )
    .subscribe(res=>{
      this.filteRxjsData = res;
    })

  }
  //map 数据结果
  getMapRxjs(){
    this.httpService.getRxjsData()
    .pipe(
      map(val => {
        val.forEach(element => {
         element['pipe'] = "map"
        });
        return val;
      })
    )
    .subscribe(res=>{
      this.mapRxjsData = res;
    })
   
  }
//
  getRxjsPush(){
    this.httpService.getRxjsPushData().subscribe(res=>{
      this.pushRxjsData = res
    })
  }

}
