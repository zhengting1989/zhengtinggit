import {Directive, ElementRef} from '@angular/core';
import {Constants} from '../constants';


@Directive({
    selector: '[read-only]'
})
export class ReadOnlyDirective {


    constructor(private element: ElementRef) {

    }

    ngOnInit() {
        this.element.nativeElement.disabled = !Constants.access;
    }
}
