export interface User {
    username: string,
    password: string
}

export interface organization_detail {
    bin: string,
    name: string,
    user?: string
}

export interface listOrg {
    count?: number,
    next: string,
    previous?: string,
    results: [organization_detail]
}

export interface category_income_detail {
    id: string,
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