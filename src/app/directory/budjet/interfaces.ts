export interface Budjet_detail {
  id?: string,
  code: string,
  name_kaz: string,
  name_rus: string
}

export interface Budjet_list {
  count?: number,
  next: string,
  previous?: string,
  results: [Budjet_detail]
}
