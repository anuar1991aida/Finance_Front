export interface classsification_income {
    id?: string,
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
    id?: string,
    code: string,
    name_kaz: string,
    name_rus: string,
    category: string,
    classs: string,
    podclass: string,
    spec: string
}