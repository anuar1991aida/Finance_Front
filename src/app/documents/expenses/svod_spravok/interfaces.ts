
export interface svod_expenses_doc {
    id: number,
    nom: string,
    _date: string,
    deleted: boolean,
    _organization: {
        id: number,
        name_rus: string
    }
}

export interface svod_expenses_tbl {
    id: number,
    god: number,
    sm1: number,
    sm2: number,
    sm3: number,
    sm4: number,
    sm5: number,
    sm6: number,
    sm7: number,
    sm8: number,
    sm9: number,
    sm10: number,
    sm11: number,
    sm12: number,
    _date: string,
    _utv_exp: number,
    _organization: number,
    _fkr_id: number,
    _fkr_code: string,
    _fkr_name: string
    _spec_id: number,
    _spec_code: string,
    _spec_name: string
}

export interface doc_izm_detail {
    id: number,
    izm_id: number,
    nom: string,
    _date: string,
    _organization_id: number,
    _organization_name: string
}

export interface svod_expenses_list {
    count?: number,
    next: string,
    previous?: string,
    results: [svod_expenses_doc]
}

export interface svod_expenses_detail {
    doc: svod_expenses_doc,
    payments: [svod_expenses_tbl],
    obligats: [svod_expenses_tbl],
    docs_izm: [doc_izm_detail]
}