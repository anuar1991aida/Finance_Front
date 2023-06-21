export interface classsification_income {
    id: number,
    code: string,
    name_kaz: string,
    name_rus: string
}

export interface classsification_income_list {
    count?: number,
    next: string,
    previous?: string,
    results: [classsification_income]
}

export interface classsification_income_detail {
    id: number,
    code: string,
    name_kaz: string,
    name_rus: string,
    _category_id: number,
    category_code: string,
    category_name: string,
    _classs_id: number,
    classs_code: string,
    classs_name: string,
    _podclass_id: number,
    podclass_code: string,
    podclass_name: string,
    _spec_id: number,
    spec_code: string,
    spec_name: string
}