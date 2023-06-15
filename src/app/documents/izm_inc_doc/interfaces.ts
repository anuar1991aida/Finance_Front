export interface izm_inc_doc_tab {
  id?: number,
  tip: string,
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
  _classification: number,
  classification_name: string
}

export interface izm_inc_doc {
  id?: string,
  nom: string,
  _date: string,
  deleted: boolean,
  _organization: number,
  org_name: string,
  _budjet: number,
  budjet_name: string,
  _type_izm_doc: number,
  type_izm_name: string
}

export interface izm_inc_doc_detail {
  doc: izm_inc_doc,
  tbl1: [izm_inc_doc_tab]

}

export interface izm_inc_doc_list {
  count?: number,
  next: string,
  previous?: string,
  results: [izm_inc_doc]

}


