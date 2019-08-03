import {AttributeBase} from './attribute.base';

export class AttributeSelect extends AttributeBase<string> {

    constructor(attributeKey: string,
                order: number,
                label: string,
                options: any,
                optionLabel: string,
                optionKey?: string,
                required?: boolean,
                defaultValue?: any) {

        super({
            attributeKey: attributeKey,
            defaultValue: defaultValue,
            required: required,
            controlType: 'select',
            label: label,
            options: {options: options, optionKey: optionKey, optionLabel: optionLabel},
            order: order
        });
    }
}