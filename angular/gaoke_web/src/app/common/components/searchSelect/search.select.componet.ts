import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {TypeaheadMatch} from 'ngx-bootstrap/typeahead';

declare var $: any;

export interface SearchOption {
    placeholder?: string;
    searchId: string; // 控件的标识id，用于区分多个select控件
    optionId: string; // 绑定值的id
    optionField: string; // input框展示内容
    asyncLoading?: boolean;
    needInput?: boolean; // 组件为typeahead+select，如果设置为true，代表需要input框中的value，且该value不属于任何一个option
}

@Component({
    selector: 'search-select',
    template: `
        <input [(ngModel)]="selected"
               [typeahead]="dataSource"
               (typeaheadOnSelect)="searchOnSelect($event)"
               [typeaheadMinLength]="0"
               [typeaheadOptionsLimit]="500"
               (blur)="blurOnSelect($event)"
               (focus)="focusOnSelect($event)"
               (keyup)="keyupOnSelect($event)"
               [typeaheadScrollable]="true"
               typeaheadOptionField="{{searchOption.optionField}}"
               placeholder="{{searchOption.placeholder}}"
               class="form-control">
    `
})
export class SearchSelectComponent {
    @Input() showItems: any[];
    @Input() selected: string;//初始化默认值
    @Input() searchOption: SearchOption;
    @Output('onSearchOnSelect') onSearchOnSelect = new EventEmitter<any>();
    @Output('asyncLoadFunction') asyncLoadFunction = new EventEmitter<any>();
    @Output('onKeyupOnSelect') onKeyupOnSelect = new EventEmitter<any>();
    lastTimeSelected: string;
    dataSource: Observable<any>;

    constructor() {
        this.dataSource = Observable.create((observer: any) => {
            observer.next(this.selected);
        }).mergeMap((token: string) => this.getSearchObservable(token));
    }

    getSearchObservable(token: string): Observable<any> {
        if (this.searchOption.asyncLoading) {
            this.asyncLoadFunction.emit(token);
        }
        return this.checkObservableOption(token);
    }

    searchOnSelect(e: TypeaheadMatch): void {
        this.selected = e.value;
        this.lastTimeSelected = e.value;
        const item = {
            key: this.searchOption.searchId,
            selected: e
        };
        this.onSearchOnSelect.emit(item);
    }

    checkObservableOption(token: string): Observable<any> {
        return Observable.of(
            this.showItems.filter((state: any) => {
                return state[this.searchOption.optionField]
            })
        );
    }

    /**
     *  未选择数据之前为清空状态
     * @param e
     */
    blurOnSelect(e): void {
        if (!this.searchOption.needInput) {
            // 大部分的控件使用这种模式，保持向后兼容性，不会修改控件行为
            this.emitSelection();
        } else {
            // 新添加的行为，除了保持之前的模式，还支持获取控件中输入的值
            this.emitInputOrSelection();
        }
    }
    private emitSelection() {
        if (this.selected) {
            this.selected = this.lastTimeSelected;
        } else {
            this.handleEmptySelection();
        }
    }

    private emitInputOrSelection() {
        if (this.selected && this.showItems.find(item => item === this.selected)) {
            this.selected = this.lastTimeSelected;
        } else if (this.selected && !this.showItems.find(item => item === this.selected)) {
            const item = {
                key: this.searchOption.searchId,
                input: this.selected
            };
            this.onSearchOnSelect.emit(item);
        } else {
            this.handleEmptySelection();
        }
    }

    private handleEmptySelection() {
        this.selected = '';
        this.lastTimeSelected = '';
        const item = {
            key: this.searchOption.searchId,
            selected: ''
        };
        this.onSearchOnSelect.emit(item);
    }

    /**
     *  选择数据之前清空
     */
    focusOnSelect(e): void {
        this.selected = '';
    }
   keyupOnSelect(e): void {
       const item = {
           key: this.selected,
           keycode: e.keyCode
       }
        this.onKeyupOnSelect.emit(item)
    }
}
