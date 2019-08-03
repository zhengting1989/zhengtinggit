import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import swal, {SweetAlertType} from 'sweetalert2';

@Injectable()
export class AlertService {

    private swal = swal;

    //'success' | 'error' | 'warning' | 'info' | 'question';
    public showSuccessAlert(title?: string, text?: string, timer?: boolean) {
        title = title ? title : '操作成功';
        text = text ? text : '';
        if (timer) {
            this.generalTimerAlert('success', title, text);
        } else {
            this.generalAlert('success', title, text);
        }
    }

    public showErrorAlert(title?: string, text?: string, timer?: boolean) {
        title = title ? title : '操作失败';
        text = text ? text : '';
        if (timer) {
            this.generalTimerAlert('error', title, text);
        } else {
            this.generalAlert('error', title, text);
        }
    }

    public showWarningAlert(title?: string, text?: string, timer?: boolean) {
        title = title ? title : '操作警告';
        text = text ? text : '';
        if (timer) {
            this.generalTimerAlert('warning', title, text);
        } else {
            this.generalAlert('warning', title, text);
        }
    }

    public showInfoAlert(title?: string, text?: string, timer?: boolean) {
        title = title ? title : '操作提示';
        text = text ? text : '';
        if (timer) {
            this.generalTimerAlert('info', title, text);
        } else {
            this.generalAlert('info', title, text);
        }
    }

    public showQuestionAlert(title?: string, text?: string, timer?: boolean) {
        title = title ? title : 'Question';
        text = text ? text : '';
        if (timer) {
            this.generalTimerAlert('question', title, text);
        } else {
            this.generalAlert('question', title, text);
        }
    }

    public showCallbackWarningAlert(confirmMethod, cancelledMethod?, title?: string, text?: string, confirmButtonText?: string, cancelButtonText?: string) {
        this.callbackQuestionAlert('warning', confirmMethod, cancelledMethod, title, text, confirmButtonText, cancelButtonText);
    }

    public showCallbackQuestionAlert(confirmMethod, cancelledMethod?, title?: string, text?: string, confirmButtonText?: string, cancelButtonText?: string) {
        this.callbackQuestionAlert('question', confirmMethod, cancelledMethod, title, text, confirmButtonText, cancelButtonText);
    }

    private callbackQuestionAlert(type: SweetAlertType, confirmMethod, cancelledMethod?, title?: string, text?: string, confirmButtonText?: string, cancelButtonText?: string) {
        this.swal({
            title: title ? title : '提示',
            text: text ? text : '确认进行此操作？',
            type: type,
            showCancelButton: true,
            confirmButtonText: confirmButtonText ? confirmButtonText : '确认',
            cancelButtonText: cancelButtonText ? cancelButtonText : '取消',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                confirmMethod.call(confirmMethod, result);
            } else if (result.dismiss === swal.DismissReason.cancel) {
                if (cancelledMethod) {
                    cancelledMethod.call(cancelledMethod, result);
                }
            }
        })
    }

    private generalAlert(type: SweetAlertType, title: string, text: string) {
        this.swal({
            type: type,
            title: title,
            text: text,
            confirmButtonText: '确认'
        })
    }

    private generalTimerAlert(type: SweetAlertType, title: string, text: string) {
        this.swal({
            type: type,
            title: title,
            text: text,
            confirmButtonText: '确认',
            timer: 1500
        })
    }
}
