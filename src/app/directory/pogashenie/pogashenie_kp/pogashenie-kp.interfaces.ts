export interface pogashenie_kp_list {
    count?: number,
    next: string,
    previous?: string,
    results: [pogashenie_kp_doc]
}

export interface pogashenie_kp_doc {
    id: number,
    _date: string,
    _classification: {
        id: number,
        code: string
    }
    _vid_budjet: {
        id: number,
        name_rus: string
    }
}