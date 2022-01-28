<template>
  <v-card flat class="lime lighten-4">
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      class="lime lighten-4"
      :headers="headers"
      :items="filteredData"
      :search="search"
    >
      <template v-slot:[`item.org`]="{ item }" class="customOrg">
        <v-icon color="blue" v-if="showIcon(item)">mdi-road-variant</v-icon>
        <span class="px-3 customOrg font-weight-black">{{ item.org }}</span>
      </template>
      <template v-slot:[`item.sum`]="{ item }">
        <v-chip color="yellow" class="font-weight-bold">
          {{ item.sumFormat }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
//Vue
import { Vue, Component, Prop } from 'vue-property-decorator'

//Types
import { Money } from '../Types/dataTypes'

//Vuex
import { namespace } from 'vuex-class'
const MoneyBalStore = namespace('MoneyBalStore')

@Component({
  name: 'TableData',
})
export default class TableData extends Vue {
  @Prop(String) readonly orgT!: string
  @Prop(String) readonly curr!: string

  //Данные хранилища
  @MoneyBalStore.Getter
  public getMoneyData!: Money[]

  get filteredData(): Money[] {
    return this.getMoneyData.filter(
      (item) => item.orgType === this.orgT && item.curr === this.curr
    )
  }

  search = ''

  headers = [
    {
      text: 'Организация',
      align: 'start',
      value: 'org',
    },
    { text: 'Счёт', value: 'acc' },
    { text: 'Остаток', value: 'sum' },
  ]

  showIcon(item: Money): boolean {
    return item.type.includes('onWay')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz&display=swap');

.customOrg {
  font-family: 'Yanone Kaffeesatz', sans-serif;
}

::v-deep tr:hover {
  cursor: pointer;
  background-color: aqua !important;
}
</style>
