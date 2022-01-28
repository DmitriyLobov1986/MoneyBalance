//Vuex
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

//Modules
import store from '@/store'

//Types
import { IMoney, Money } from '@/Types/dataTypes'
import { IloginomData, IloginomVarr, LoginomCommon } from '@/Types/loginomTypes'
import { Opt } from '@/Types/optionsTypes'
import { Select, baseTypes } from '@/Types/selectTypes'
import {
  fieldsFilter,
  optionsFilter,
  setFilterItems,
} from '@/helpers/vuexHelpers'

import Vue from 'vue'

//Interaces
interface Payload {
  newValue: string[]
  index: number
}

//Lodash
import { sortBy } from 'lodash'

@Module({
  dynamic: true,
  name: 'MoneyBalStore',
  namespaced: true,
  store,
})
export default class MoneyBalStore extends VuexModule {
  //State and Getters
  //Остатки
  public ost: Money[] = []
  get getMoneyData(): Money[] {
    const ostFilt = fieldsFilter(this.ost, this.filters)
    const ostOpt = optionsFilter(ostFilt, this.options)
    return sortBy(ostOpt, ['org', 'acc'])
  }
  //Фильтры
  public options: Opt = {
    startEnd: false,
    onAccount: true,
    onWay: true,
  }
  public filters: Select[] = [
    {
      items: [],
      label: 'По валюте',
      data: 'curr',
      value: [],
    },
    {
      items: baseTypes,
      label: 'По типу организации',
      data: 'orgType',
      value: [],
    },
    {
      items: [],
      label: 'По организации',
      data: 'org',
      value: [],
    },
  ]
  //Actions and Mutations
  @Action
  public async updateData(dateLoad: string): Promise<boolean> {
    const credentials = `Basic ${btoa('Http:Qwerty!!!!!')}`
    const urlMoney =
      'http://main-sql02.ukritter.local:8080/Fabrika//hs/Reports/service/moneyOst'
    const config = {
      headers: {
        'content-type': 'text/plain;charset=utf-8',
        Authorization: credentials,
      },
      timeout: 15000,
    }
    const params: IloginomVarr<LoginomCommon> = {
      Variables: {
        dateLoad,
      },
    }
    try {
      const response = await Vue.axios.post<IloginomData<IMoney>>(
        urlMoney,
        params,
        config
      )
      const moneyData = response.data.DataSet.Rows
      this.context.commit('setData', { payload: moneyData })

      //Обновим курсы валют
      this.context.dispatch(
        'RateStore/updateCurr',
        {
          params,
          moneyData,
        },
        { root: true }
      )
      //Обновим деньги в пути
      this.context.dispatch('MoneyOnWay/updateMoneyOnWay', params, {
        root: true,
      })

      return false
    } catch (error) {
      console.log('ОШИБКА!!!!! ', error)
      return true
    }
  }
  @Mutation
  public setData({
    payload,
    reWrite = true,
  }: {
    payload: IMoney[] | Money[]
    reWrite: boolean
  }): void {
    //Остатки

    if (reWrite) {
      this.ost = payload.map((v) => {
        return new Money(v)
      })
    } else {
      this.ost = [...this.ost, ...(payload as Money[])]
    }

    //Фильтры
    setFilterItems(this.ost, this.filters)
  }
  @Mutation
  public clearData(): void {
    this.ost = []
  }
  @Mutation
  public setOptions(opt: Opt): void {
    this.options = { ...opt }
  }
  @Mutation
  public setFilters({ newValue, index }: Payload): void {
    this.filters[index].value = newValue
    this.filters = [...this.filters]
  }
}
