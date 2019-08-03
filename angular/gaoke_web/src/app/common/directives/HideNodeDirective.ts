import {Directive, ElementRef, Renderer2} from '@angular/core';
import {Constants} from '../constants';

@Directive({
    selector: '[hide-node]'
})
export class HideNodeDirective {

    constructor(private element: ElementRef, private  renderer2: Renderer2) {

    }

    ngOnInit() {
        if (!Constants.access) {
            this.renderer2.setStyle(
                this.element.nativeElement,
                'display',
                'none'
            );
        }
    }
}
