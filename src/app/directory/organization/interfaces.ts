export interface organization_detail {
    id?: string,
    budjet_name: string,
    bin: string,
    name_kaz: string,
    name_rus: string,
    adress: string,
    _budjet: number
}

export interface organization_list {
    count?: number,
    next: string,
    previous?: string,
    results: [organization_detail]
}
