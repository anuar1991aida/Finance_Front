export interface izm_inc_doc_tab {
  id?: number,
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
  date: string,
  _utv_inc: number,
  _classification: number,
  _organization: number

}

export interface izm_inc_doc {
  id?: number,
  org_name: string,
  budjet_name: string,
  nom: string,
  date: string,
  deleted: boolean,
  _organization: number,
  _budjet: number
}

export interface izm_inc_doc_detail {
  doc: [],
  tbl1: [izm_inc_doc_tab]

}

export interface izm_inc_doc_list {
  count?: number,
  next: string,
  previous?: string,
  results: [izm_inc_doc_detail]

}


