export interface organization_detail {
    id?: string,
    bin: string,
    name: string,
    user?: string
}

export interface organization_list {
    count?: number,
    next: string,
    previous?: string,
    results: [organization_detail]
}