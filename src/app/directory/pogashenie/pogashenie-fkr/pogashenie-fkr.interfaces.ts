export interface pogashenie_fkr_list {
    count?: number,
    next: string,
    previous?: string,
    results: [pogashenie_fkr_doc]
}

export interface pogashenie_fkr_doc {
    id: number,
    _date: string,
    _fkr: {
        id: number,
        code: string
    }
    _vid_budjet: {
        id: number,
        name_rus: string
    }
}