<template>
  <v-card :id="orgT" flat color="light-blue lighten-4" height="100%">
    <v-card-title class="customFont">
      <div>{{ typeAliase }}</div>
      <v-expand-transition>
        <div v-if="showTotal" class="px-5 text-h5 brown--text font-weight-bold">
          {{ totalAmount }}
        </div>
      </v-expand-transition>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels popout flat>
        <v-expansion-panel
          class="amber lighten-3"
          v-for="(value, key) in filterCurrDiv"
          :key="key"
        >
          <v-expansion-panel-header class="font-weight-bold">
            <v-row>
              <v-col cols="3">{{ key }}</v-col>
              <v-col>{{ numFormat(value) }}</v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <TabelData :orgT="orgT" :curr="key"></TabelData>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
//Vue
import { Vue, Component, Prop } from 'vue-property-decorator'

//Types
import { Money, Igroup, IMoney, OrgTypes } from '../Types/dataTypes'

//Components
import TabelData from '@/components/TableData.vue'

//Vuex
import { namespace } from 'vuex-class'
const MoneyBalStore = namespace('MoneyBalStore')
const RateStore = namespace('RateStore')

//Numeral
import numeral from 'numeral'

//Helpers
import { totalAmount as totalAmountStr } from '@/helpers/helper'

@Component({
  name: 'Cards',
  components: { TabelData },
})
export default class Cards extends Vue {
  @Prop(String) readonly orgT!: keyof typeof OrgTypes
  @Prop(String) readonly currentCurr!: string

  //Данные хранилища
  @RateStore.Getter
  public getCurrObj!: Igroup

  @MoneyBalStore.Getter
  public getMoneyData!: Money[]

  get showTotal(): boolean {
    return !!this.getCurrObj
  }

  //Вычисляемые свойства
  get typeAliase(): string {
    return OrgTypes[this.orgT]
  }

  //Группировка по валюте
  get filterCurrDiv(): Igroup {
    const currGroup = this.getMoneyData
      .filter((v) => v.orgType === this.orgT)

      .sort((a: IMoney, b: IMoney) => {
        if (a.curr === 'RUB') {
          return -1
        } else {
          return a.curr < b.curr ? -1 : 1
        }
      })

      .reduce((acc: Igroup, curV: IMoney): Igroup => {
        acc[curV.curr] = (acc[curV.curr] || 0) + curV.sum
        return acc
      }, {} as Igroup)

    return currGroup
  }

  //Общая сумма в одной валюте
  get totalAmount(): string {
    const rate = this.getCurrObj[this.currentCurr]
    return ` 
        ${totalAmountStr(
          this.getMoneyData.filter((v) => v.orgType === this.orgT),
          this.getCurrObj,
          rate
        )} ${this.currentCurr} `
  }

  //формат числовых выражений
  numFormat(param: number): string {
    return numeral(param)
      .format('0,0')
      .replaceAll(',', ' ')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bitter&display=swap');
.customFont {
  font-family: 'Bitter', serif;
  font-size: 25px;
  font-weight: bold;
}
#Розница {
  border-left: 2px solid blue !important;
}
#Опт {
  border-left: 2px solid red !important;
}
#Управление {
  border-left: 2px solid yellow !important;
}
#Таможня {
  border-left: 2px solid rgb(42, 156, 42) !important;
}
#Глоссаб {
  border-left: 2px solid rgba(0, 255, 251, 0.782) !important;
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 4px !important;
}
</style>
