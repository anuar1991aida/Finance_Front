export interface utv_income_doc {
    id?: string,
    org_name: string,
    budjet_name: string,
    nom: string,
    _date: string,
    deleted: boolean,
    _organization: number,
    _budjet: number
}

export interface utv_income_doc_tab {
    id?: string,
    deleted: boolean,
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
    _organization: number,
    _utv_inc: number,
    _classification: number,
    classification_name: string
}

export interface utv_income_list {
    count?: number,
    next: string,
    previous?: string,
    results: [utv_income_doc]
}

export interface utv_income_detail {
    doc: utv_income_doc,
    tbl1: [utv_income_doc_tab]
}