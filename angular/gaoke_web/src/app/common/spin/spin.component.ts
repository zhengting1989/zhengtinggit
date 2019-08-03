import {Component, OnDestroy} from '@angular/core';
import {SpinService} from './spin.service';
import {Constants} from '../constants';

@Component({
    selector: 'atnd-spin',
    templateUrl: './spin.component.html',
    styleUrls: ['./spin.component.scss']
})
export class SpinComponent implements OnDestroy {

    showSpin: boolean = false;
    count: number = 0;
    interval;

    constructor(private spinService: SpinService) {
        let dyComponent = this;
        this.spinService.getSpin().forEach((showSpin: boolean) => {
            if (showSpin) {
                dyComponent.openSpin();
                Constants.SPIN_CACHE = 'openSpin';
                dyComponent.destroyInterval();
            } else {
                dyComponent.closeSpin();
                clearInterval(dyComponent.interval);
            }
        });

    }

    destroyInterval() {
        let dyInterval = this;
        this.interval = setInterval(() => {
            if (Constants.SPIN_CACHE === 'closeSpin') {
                dyInterval.showSpin = false;
                dyInterval.count = 0;
                clearInterval(dyInterval.interval);
            }
        }, 50);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    /**
     * 打开
     */
    private openSpin() {
        if (!this.showSpin) {
            this.showSpin = true;
        }
        this.count++;
    }

    /**
     * 关闭
     */
    private closeSpin() {
        this.count--;
        if (this.count <= 0) {
            this.showSpin = false;
            this.count = 0;
        }
    }


}