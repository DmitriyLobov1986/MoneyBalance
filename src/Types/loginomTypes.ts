//Типы
export type LoginomCommon = { [key: string]: number | string | Date }
export type LoginomAuth = {
  answer: string
  resolved: boolean
}

//Интерфейсы
export interface IloginomData<T> {
  [key: string]: { Rows: T[] }
}

export interface IloginomVarr<T> {
  Variables: T
}
