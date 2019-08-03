import {AttributeBase} from './attribute.base';

export class AttributeInput extends AttributeBase<string> {

    constructor(attributeKey: string,
                order: number,
                label: string,
                required?: boolean,
                type?: any,
                defaultValue?: any,
                options?: any) {

        super({
            attributeKey: attributeKey,
            defaultValue: defaultValue,
            required: required,
            controlType: type ? type : 'text',
            label: label,
            options: {options: options},
            order: order
        });
    }
}

