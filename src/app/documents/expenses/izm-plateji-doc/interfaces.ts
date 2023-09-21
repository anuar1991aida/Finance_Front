import { organization_detail } from '../../../directory/organization/interfaces'
import { type_izm_doc } from '../../income/izm_inc_doc/interfaces'
import { fkr_detail } from '../../../directory/expenses/fkr/interfaces'
import { specification_income_detail } from '../../../directory/income/specification-income/interfaces'


export interface izm_plateji_doc {
    id: number,
    nom: string,
    _date: string,
    deleted: boolean,
    doc_hash: string,
    _organization: organization_detail,
    _type_izm_doc: type_izm_doc
}

export interface izm_plateji_doc_list {
    count?: number,
    next: string,
    previous?: string,
    results: [izm_plateji_doc]
}

export interface izm_plateji_detail {
    doc: izm_plateji_doc,
    payments: [izm_plateji_table],
    obligats: [izm_plateji_table]
}

export interface izm_plateji_table {
    id: number,
    _fkr: fkr_detail,
    _spec: specification_income_detail,
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
    utv1: number,
    utv2: number,
    utv3: number,
    utv4: number,
    utv5: number,
    utv6: number,
    utv7: number,
    utv8: number,
    utv9: number,
    utv10: number,
    utv11: number,
    utv12: number,
    itog1: number,
    itog2: number,
    itog3: number,
    itog4: number,
    itog5: number,
    itog6: number,
    itog7: number,
    itog8: number,
    itog9: number,
    itog10: number,
    itog11: number,
    itog12: number
}