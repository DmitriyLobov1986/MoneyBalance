//Types
import { Money } from '../Types/dataTypes'
import { Opt } from '../Types/optionsTypes'
import { Items, Select } from '../Types/selectTypes'

//Фильтрация массива остатков по опциям
export const optionsFilter = (ost: Money[], options: Opt): Money[] => {
  const ostType = !options.startEnd ? 'onStart' : 'onEnd'
  const onWayType = !options.startEnd
    ? ['onWayStart', 'onWayStartEnd']
    : ['onWayStartEnd', 'onWayEnd']

  const onAccount = options.onAccount
    ? ost.filter((value) => value.type === ostType)
    : []

  const onWay = options.onWay
    ? ost.filter((value) => onWayType.includes(value.type))
    : []

  return [...onAccount, ...onWay]
}

//Фильтрация массива остатков по полям
export const fieldsFilter = (ost: Money[], filters: Select[]): Money[] => {
  return ost.filter((item) => {
    let use = true

    for (const f of filters) {
      const res = f.value.includes(item[f.data])

      if (!res && f.value.length > 0) {
        use = false
        break
      }
    }

    return use
  })
}

//Установка списка выбора
export const setFilterItems = (ost: Money[], filters: Select[]): void => {
  let header = ''

  ost
    .sort((a, b) => (a.orgType < b.orgType ? -1 : 1))

    .forEach((item) => {
      const newFilter = filters.filter((f) => f.data !== 'orgType')
      for (const filter of newFilter) {
        const items = filter.items as Items[]

        if (header !== item.orgType && filter.data === 'org') {
          header = item.orgType
          items.push({
            header: header,
          })
        }

        items.push({
          text: item[filter.data],
          value: item[filter.data],
        })
      }
    })
}
