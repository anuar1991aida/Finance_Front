export interface specification_income_detail {
    id?: string,
    code: string,
    name_kaz: string,
    name_rus: string
}

export interface specification_income_list {
    count?: number,
    next: string,
    previous?: string,
    results: [specification_income_detail]
}