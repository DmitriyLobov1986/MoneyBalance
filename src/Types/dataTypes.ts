//Numeral
import numeral from 'numeral'

//Энумы
export enum OrgTypes {
  Розница = 'Розница',
  Опт = 'Опт',
  Управление = 'Управление',
  Таможня = 'Армения',
  Глоссаб = 'Запад',
}

//Интерфейсы
export interface IMoney {
  orgType: OrgTypes | string
  org: string
  acc: string
  curr: string
  type: string
  sum: number
}

export type Icurr = {
  time?: Date
  currency?: string
  rate: number
}

//
export interface Igroup {
  [key: string]: number
}

//Классы
export class Money implements IMoney {
  orgType: OrgTypes
  org: string
  acc: string
  curr: string
  type: string
  sum: number

  constructor(obj: IMoney) {
    this.orgType =
      obj.orgType === 'Звено' ? OrgTypes.Опт : (obj.orgType as OrgTypes)
    this.org = obj.org
    this.acc = obj.acc
    this.curr = obj.curr
    this.type = obj.type
    this.sum = obj.sum
  }

  get sumFormat(): string {
    return numeral(this.sum).format('0,0')
  }
}
