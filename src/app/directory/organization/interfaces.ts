import { abp_detail } from "../expenses/ABP/interfaces"
import { Budjet_detail } from "../income/budjet/interfaces"

export interface organization_detail {
    id: number,
    bin: string,
    name_kaz: string,
    name_rus: string,
    adress: string,
    _budjet: Budjet_detail,
    is_abp: boolean,
    deleted: boolean
    codeorg: string
    _abp: abp_detail,
    _region: string,
    parent_organizations: [parent_detail],
    regions: [
        {
            name: string
        }
    ]
}

export interface parent_detail {
    id: number,
    _date: string,
    _organization: number,
    _parent: {
        id: number,
        name_rus: string
    }
}

export interface params_org {
    _organization_id: number,
    _parent_id: number,
    _date: string
}

export interface organization_list {
    count?: number,
    next: string,
    previous?: string,
    results: [organization_detail]
}

export interface organization_select {
    count?: number,
    next: string,
    previous?: string,
    results: [organization_detail]
}
