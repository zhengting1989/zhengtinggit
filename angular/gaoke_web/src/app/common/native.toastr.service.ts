import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {IndividualConfig} from "ngx-toastr/toastr/toastr-config";

@Injectable()
export class NativeToastrService {

    constructor(private toastr: ToastrService) {
    }

    public positionClass: string;
    public disableTimeOut: boolean = false;
    public progressBar: boolean = true;

    defaultIndividualConfig: any = {
        timeOut: 3000,
        tapToDismiss: true,
        closeButton: true,
        preventDuplicates: true,
        easeTime: 400,
        disableTimeOut: true,
        progressBar: true,
        progressAnimation: 'decreasing'
    };

    /** show successful toast */
    showSuccess(title?: string, message?: string, individualConfigOverride?: IndividualConfig):number {
        message = message ? message : '';
        title = title ? title : '操作成功';
        return this.toastr.success(message, title, this.getDefaultIndividualConfig(individualConfigOverride)).toastId;
    }

    /** show error toast */
    showError(title?: string, message?: string, individualConfigOverride?: IndividualConfig):number {
        message = message ? message : '';
        title = title ? title : '操作失败';
        return this.toastr.error(message, title, this.getDefaultIndividualConfig(individualConfigOverride)).toastId;
    }

    /** show info toast */
    showInfo(title?: string, message?: string, individualConfigOverride?: IndividualConfig):number {
        message = message ? message : '';
        return this.toastr.info(message, title, this.getDefaultIndividualConfig(individualConfigOverride)).toastId;
    }

    /** show warning toast */
    showWarning(title?: string, message?: string, individualConfigOverride?: IndividualConfig):number {
        message = message ? message : '';
        title = title ? title : '操作警告';
        return this.toastr.warning(message, title, this.getDefaultIndividualConfig(individualConfigOverride)).toastId;
    }

    clearToastr(index?:number) {
        this.toastr.clear(index);
    }

    getDefaultIndividualConfig(individualConfigOverride?: IndividualConfig): IndividualConfig {
        individualConfigOverride = individualConfigOverride ? individualConfigOverride : this.defaultIndividualConfig;
        individualConfigOverride.disableTimeOut = this.disableTimeOut;
        individualConfigOverride.progressBar = this.progressBar;
        if (this.positionClass) {
            individualConfigOverride.positionClass = this.positionClass;
        }
        return individualConfigOverride;
    }

}
