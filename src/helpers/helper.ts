//Types
import { Igroup, Money } from '../Types/dataTypes'
type Total = string | number

//Numeral
import numeral from 'numeral'

//Подсчёт общей суммы в одной валюте
export const totalAmount = (
  dataArr: Money[],
  currObj: Igroup,
  rate: number,
  returnString = true
): Total => {
  const totalAmount = dataArr.reduce((acc: number, val: Money) => {
    acc = acc + val.sum * ((currObj[val.curr] ?? 1) / rate)
    return acc
  }, 0)

  if (returnString) {
    return numeral(totalAmount).format('0,0')
  } else {
    return totalAmount
  }
}
