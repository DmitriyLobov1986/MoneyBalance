<template>
  <v-container fluid pt-5>
    <v-row justify="center" class="mb-5" style="height: 36px">
      <v-col class="text-center">
        <v-btn v-if="loading" loading color="blue lighten-2" small fab>
          <v-icon dark>
            mdi-cloud-upload
          </v-icon>
        </v-btn>
        <transition-group name="custom-appear" appear @after-enter="afterEnter">
          <div v-for="(curr, index) of getCurr" :key="curr">
            <v-btn
              v-if="index === activeCurr"
              @click="changeCurr"
              rounded
              outlined
              color="indigo"
              width="275px"
              >{{ totalFormat }} {{ curr }}</v-btn
            >
          </div>
        </transition-group>
      </v-col>
    </v-row>
    <SelectField
      :filters="filters"
      @set-filters="
        setVuexFilters($event), selectBase($event.newValue, $event.index)
      "
    />
  </v-container>
</template>

<script lang="ts">
//Vue
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'

//Types
import { Igroup, Money, OrgTypes } from '../Types/dataTypes'
import { Select } from '@/Types/selectTypes'

//Vuex
import { namespace } from 'vuex-class'
const MoneyBalStore = namespace('MoneyBalStore')
const RateStore = namespace('RateStore')

//Helpers
import { totalAmount as totalAmountStr } from '@/helpers/helper'
import numeral from 'numeral'

//GSAP
import { gsap } from 'gsap'

//Components
import SelectField from '@/components/SelectField.vue'

@Component({
  name: 'Total',
  components: {
    SelectField,
  },
})
export default class Total extends Vue {
  //Данные хранилища
  @MoneyBalStore.State
  public filters!: Select[]

  @MoneyBalStore.Mutation('setFilters')
  public setVuexFilters!: (payload: {
    newValue: string[]
    index: number
  }) => void

  @RateStore.Getter
  public getCurrObj!: Igroup

  @MoneyBalStore.Getter
  public getMoneyData!: Money[]

  value: string[] = Object.keys(OrgTypes)
  activeCurr = 0
  total = { amount: 0 }
  animated = false

  get totalFormat(): string {
    return numeral(this.total.amount).format('0,0')
  }

  selectBase(data: string[], index: number): void {
    if (index === 1) {
      this.$emit('select-base', data)
    }
  }

  @Emit()
  selectCurr(curr: string): string {
    return curr
  }

  @Watch('totalAmount')
  onGetMoneyDataChanged(newValue: number): void {
    gsap.to(this.total, { duration: 0.5, amount: newValue })
  }

  afterEnter(el: HTMLElement): void {
    if (el.childElementCount > 0) {
      this.animated = true
    }
  }

  get loading(): boolean {
    return this.getMoneyData.length > 0 && !this.getCurrObj
  }

  get getCurr(): string[] {
    if (this.getCurrObj) {
      return Object.keys(this.getCurrObj).reverse()
    } else {
      return []
    }
  }

  get totalAmount(): number {
    if (!this.getCurrObj || !this.animated) {
      return 0
    }

    const curr = this.getCurr[this.activeCurr]
    const rate = this.getCurrObj[curr]
    return totalAmountStr(
      this.getMoneyData.filter((v) => this.value.includes(v.orgType)),
      this.getCurrObj,
      rate,
      false
    ) as number
  }

  changeCurr(): void {
    this.activeCurr++
    if (this.activeCurr === this.getCurr.length) {
      this.activeCurr = 0
    }
    this.selectCurr(this.getCurr[this.activeCurr])
  }
}
</script>

<style scoped>
.custom-appear-enter {
  opacity: 0;
  transform: scale(0);
}
.custom-appear-enter-to {
  opacity: 1;
  transform: scale(1);
}
.custom-appear-enter-active {
  transition: all 1.5s ease;
}
</style>
