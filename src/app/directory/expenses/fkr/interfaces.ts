export interface fkr_detail {
    id: number,
    code: string,
    name_kaz: string,
    name_rus: string
}

export interface fkr_list {
    count?: number,
    next: string,
    previous?: string,
    results: [fkr_detail]
}