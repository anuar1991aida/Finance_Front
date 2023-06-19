export interface class_income_detail {
    id?: string,
    code: string,
    name_kaz: string,
    name_rus: string
}

export interface class_income_list {
    count?: number,
    next: string,
    previous?: string,
    results: [class_income_detail]
}