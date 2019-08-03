import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from './constants';
import { Router } from '@angular/router';

export interface RestOption {
    restUrl: string;
    httpHeader?: HttpHeaders;
    restBody?: any
    restHttpParams?: Object;
    responseType?: any;
}

@Injectable()
export class RestService { 
    intervaltimer:any;
    constructor(private httpClient: HttpClient, private router: Router) {
    }

    public post(option: RestOption): Observable<any> {
        return Observable.defer(() => {
            return this.httpClient.post(option.restUrl, option.restBody, this.getHttpOptions(option));
        }).retryWhen((error) => {
            return this.refresh(error);
        });
    }

    public get(option: RestOption): Observable<any> {
        return Observable.defer(() => {
            return this.httpClient.get(option.restUrl, this.getHttpOptions(option));
        }).retryWhen((error) => {
            return this.refresh(error);
        });
    }

    public put(option: RestOption): Observable<any> {
        return Observable.defer(() => {
            return this.httpClient.put(option.restUrl, option.restBody, this.getHttpOptions(option));
        }).retryWhen((error) => {
            return this.refresh(error);
        });
    }

    public delete(option: RestOption): Observable<any> {
        return Observable.defer(() => {
            return this.httpClient.delete(option.restUrl, this.getHttpOptions(option));
        }).retryWhen((error) => {
            return this.refresh(error);
        });
    }

    private refresh(obs: Observable<any>): Observable<any> {
        return obs.switchMap((x: any) => {
            if (x.status === 401 && x.json().msg == 'token.expired') {
                return Observable.of(x);
            } else {
            }
            return Observable.throw(x);
        }).flatMap(() => {
            return this.refreshToken().map(res => {
                // Update local storage token
                sessionStorage.setItem(Constants.AUTH_KEY, res.options.token);
            });
        });
    }

    private refreshToken(): Observable<any> {
        return this.get({restUrl: '/user/token'});
    }


    private getHttpOptions(option: RestOption): {} {
        this.setOverdueTime();
        let optionHttpHeader = option.httpHeader;
        if (!optionHttpHeader) {
            let headerHttp = new HttpHeaders();
            headerHttp = headerHttp.set('Content-Type', 'application/json;charset=UTF-8');
            optionHttpHeader = headerHttp;
        }
        optionHttpHeader = optionHttpHeader.set('Authorization', 'Bearer ' + JSON.parse(sessionStorage.getItem(Constants.AUTH_KEY)));
        let params = option.restHttpParams || [];
        let httpParams: HttpParams = new HttpParams();
        for (let paramKey in params) {
            if (params.hasOwnProperty(paramKey)) {
                let paramValue = params[paramKey];
                httpParams = httpParams.set(paramKey, paramValue);
            }
        }
        if (!option.responseType) {
            option.responseType = 'json'
        }
        let httpOptions = {
            headers: optionHttpHeader,
            params: httpParams,
            body: option.restBody,
            responseType: option.responseType,
        };
        return httpOptions;
    }
    setOverdueTime(){
        let time = Math.round(Constants.OVERDUE_TIME * 60);
        clearInterval(this.intervaltimer);
        this.intervaltimer = setInterval(()=>{
            time--;
            if(time==0){
                clearInterval(this.intervaltimer);
                location.reload(); 
                this.router.navigateByUrl("login");
                console.log("页面无操作，退出到登录页面")
            }
        }, 1000)
    }
}