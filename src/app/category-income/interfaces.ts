export interface category_income_detail {
    id?: string,
    code: string,
    name_kaz: string,
    name_rus: string
}

export interface category_income_list {
    count?: number,
    next: string,
    previous?: string,
    results: [category_income_detail]
}