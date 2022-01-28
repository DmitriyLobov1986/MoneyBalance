//vuex
import store from '@/store'
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'

//types
import { IloginomData, IloginomVarr, LoginomCommon } from '@/Types/loginomTypes'

//vue
import Vue from 'vue'
import { IMoney, Money, OrgTypes } from '@/Types/dataTypes'

@Module({ dynamic: true, name: 'MoneyOnWay', namespaced: true, store })
export default class MoneyOnWay extends VuexModule {
  moneyOnWay: Money[] = []

  @Action
  public async updateMoneyOnWay(
    params: IloginomVarr<LoginomCommon>
  ): Promise<void> {
    const url =
      'http://main-ts02.ukritter.local/lgi/Service.svc/Rest/Инкасация_Эквайринг/MoneyOnWay'

    const config = {
      headers: {
        'content-type': 'text/plain;charset=utf-8',
      },
    }

    params.Variables
    const data = {
      Variables: params.Variables,
      DataSet2: {
        Rows: [],
      },
    }

    try {
      const response = await Vue.axios.post<IloginomData<LoginomCommon>>(
        url,
        data,
        config
      )

      //current commit
      this.context.commit('setMoneyOnWay', response.data.DataSet.Rows)
      //remote commit
      this.context.commit(
        'MoneyBalStore/setData',
        {
          payload: this.moneyOnWay,
          reWrite: false,
        },
        { root: true }
      )
    } catch (err) {
      console.log(err)
    }
  }

  @Mutation
  public setMoneyOnWay(payload: IMoney[]): void {
    this.moneyOnWay = [...payload].map((v) => {
      v.orgType = OrgTypes.Розница
      v.curr = 'RUB'
      v.type = 'onWayStartEnd'
      return new Money(v)
    })
  }
}
