export class AttributeBase<T> {
    order: number;
    controlType: string;
    attributeKey: any;
    label: string;
    required: boolean;
    defaultValue: string;
    options: any;

    constructor(options: {
        attributeKey?: any,
        defaultValue?: string,
        required?: boolean,
        controlType?: string,
        label?: string,
        options?: any,
        order?: number
    } = {}) {
        this.defaultValue = options.defaultValue === undefined || options.defaultValue === 'undefined' ? '' : options.defaultValue;
        this.attributeKey = options.attributeKey || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.options = options.options || {};
    }
}