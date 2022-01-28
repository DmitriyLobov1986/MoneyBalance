//Vuex
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import store from '@/store/index'

import { IMoney, Igroup, Icurr } from '@/Types/dataTypes'
import { IloginomData, IloginomVarr, LoginomCommon } from '@/Types/loginomTypes'
import Vue from 'vue'
import { groupBy, forEach } from 'lodash'

@Module({ dynamic: true, name: 'RateStore', namespaced: true, store })
export default class RateStore extends VuexModule {
  private currObj: Igroup = {}

  public currArray: Igroup[] = []

  get getCurrObj(): Igroup {
    return this.currArray[0]
  }

  @Action
  public async updateCurr({
    params,
    moneyData,
  }: {
    params: IloginomVarr<LoginomCommon>
    moneyData: IMoney[]
  }): Promise<void> {
    const url =
      'http://main-ts02.ukritter.local/lgi/Service.svc/Rest/Загрузка_курсов/GetCurrencyRates'

    const curList = moneyData.reduce((acc: string, v: IMoney) => {
      if (!acc.includes(v.curr)) {
        acc += `${v.curr},`
      }
      return acc
    }, '')

    const config = {
      headers: {
        'content-type': 'text/plain;charset=utf-8',
      },
    }

    params.Variables.CurCode = curList
    params.Variables.BaseCur = 'RUB'
    params.Variables.EndDate = new Date(params.Variables.dateLoad)
    params.Variables.StartDate = new Date(params.Variables.dateLoad)
    params.Variables.StartDate.setDate(
      params.Variables.StartDate.getDate() - 10
    )

    try {
      const response = await Vue.axios.post<IloginomData<Icurr>>(
        url,
        params,
        config
      )
      this.context.commit('setCurr', response.data.DataSet.Rows)
    } catch (error) {
      console.log(error)
    }
  }

  @Mutation
  public setCurr(newData: Icurr[]): void {
    this.currArray.splice(0, 1)
    this.currObj = {}

    const groupByCurr = groupBy(newData, 'currency')

    forEach(groupByCurr, (value, key) => {
      const lastValue = value.length - 1
      this.currObj[key] = value[lastValue].rate
    })

    this.currObj.RUB = 1
    this.currArray.push(this.currObj)
  }
  @Mutation
  public clearRateData(): void {
    this.currArray = []
  }
}
