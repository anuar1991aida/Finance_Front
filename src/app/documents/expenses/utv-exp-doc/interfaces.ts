export interface utv_expenses_doc {
    id: number,
    org_name: string,
    budjet_name: string,
    nom: string,
    _date: string,
    deleted: boolean,
    _organization: number,
    _budjet: number
}

export interface utv_expenses_payments {
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
    fkr_name: string,
    fkr_code: string,
    spec_name: string,
    spec_code: string,
    _date: string,
    _utv_exp: number,
    _organization: number,
    _fkr: number,
    _spec: number
}

export interface utv_expenses_obligats {
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
    fkr_name: string,
    fkr_code: string,
    spec_name: string,
    spec_code: string,
    _date: string,
    _utv_exp: number,
    _organization: number,
    _fkr: number,
    _spec: number
}

export interface utv_expenses_list {
    count?: number,
    next: string,
    previous?: string,
    results: [utv_expenses_doc]
}

export interface utv_expenses_detail {
    doc: utv_expenses_doc,
    payments: [utv_expenses_payments],
    obligats: [utv_expenses_obligats]
}