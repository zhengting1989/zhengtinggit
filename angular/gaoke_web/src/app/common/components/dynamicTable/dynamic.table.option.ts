export interface DynamicTableOption {
    addBtn?: boolean;
    delBtn?: boolean;
    putBtn?: boolean;
    detailBtn?: boolean;
    searchBtn?: boolean;
    searchPlaceholder?: string;
    hideWorkbench?: boolean;
    singleMethods?: BtnMethod [];
    globalMethods?: BtnMethod [];
    verifyFieldMethods?: VerifyFieldMethod [];
    deleteMessage?: string;
}

export interface BtnMethod {
    type: string;
    label: string;
    faIcon: string;
    class?: string;
    access?: boolean;
    checkboxUsed?: boolean;
}

//form 校验特殊校验
export interface VerifyFieldMethod {
    field: string;
    label: string;
    function: any;
}