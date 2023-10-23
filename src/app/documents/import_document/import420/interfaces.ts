export interface import420_detail {
  doc: import420_doc,
  table: [import420_tab]
}


export interface import420_doc {
  id: number,
  nom: string,
  _date: string,
  deleted: boolean,
  _budjet: {
    id: number,
    code: string,
    name_kaz: string,
    name_rus: string,
    adress: string,
    _parent: number
  },
  _organization: {
    id: number,
    name_rus: string
  }

}

export interface import420_list {
  count?: number,
  next: string,
  previous?: string,
  results: [import420_doc]
}


export interface import420_tab {
  id: number,
  _classification_id: number,
  code: string,
  name: string,
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
}
