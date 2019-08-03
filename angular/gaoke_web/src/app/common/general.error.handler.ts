import {ErrorHandler, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Constants} from './constants';
import {AlertService} from './alert.service';

@Injectable()
export class GeneralErrorHandler implements ErrorHandler {

    constructor(public alertService: AlertService) {
    }

    handleError(error: HttpErrorResponse) {
        Constants.SPIN_CACHE = 'closeSpin';
        let httpCode: number = error.status;
        let errMsg: string = '';
        let errCode: string = '';
        switch (httpCode) {
            case 401:
                console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
                break;
            default:
                try {
                    errMsg = error.error.errorMessage;
                    errCode = error.error.errorCode;
                } catch (e) {
                    console.log('catch error while parsing error , error is : ' + error);
                    //errMsg = '服务异常';
                }
                if (errMsg) {
                    this.alertService.showErrorAlert(errCode, errMsg)
                }
                break;
        }
    }
}
