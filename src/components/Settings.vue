<template>
  <v-dialog persistent max-width="600" v-model="dialog" @input="getVuexOptions">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="hidden-md-and-down"
        plain
        small
        color="grey"
        v-bind="attrs"
        v-on="on"
      >
        Настройки
        <v-icon right>mdi-cog-outline</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2">
        Настройки отображения остатков
      </v-card-title>

      <v-card-text>
        <!-- Выбор даты загрузки -->
        <v-menu
          v-model="datePicker"
          :disabled="loading"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formatedDate"
              label="Дата загрузки остатков"
              hint="DD/MM/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="datePicker = false"
          ></v-date-picker>
        </v-menu>

        <!-- Настройки параметров отображения -->
        <v-container fluid>
          <v-row>
            <v-col cols="5">
              <v-switch
                v-model="options.startEnd"
                inset
                :label="options.startEnd ? 'На конец дня' : 'На начало дня'"
                color="indigo"
              ></v-switch>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="options.onAccount"
                label="На счету"
                color="indigo"
              >
              </v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox v-model="options.onWay" label="В пути" color="indigo">
              </v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Alert неудачной загрузки -->
      <v-alert
        class="mx-auto"
        v-model="alert"
        type="warning"
        width="500px"
        transition="scale-transition"
        dark
      >
        Неудачная загрузка данных!!!
      </v-alert>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="loading"
          color="primary"
          text
          @click="dialog = loading = alert = false"
        >
          Отменить
        </v-btn>
        <v-btn
          color="primary"
          text
          :loading="loading"
          @click="modify ? loadData() : changeOptions()"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
//Vue
import { Component, Vue, Watch } from 'vue-property-decorator'

//Vuex
import { namespace } from 'vuex-class'
const MoneyBalStore = namespace('MoneyBalStore')
const RateStore = namespace('RateStore')

//Types
import { Opt } from '@/Types/optionsTypes'

@Component({
  name: 'Settings',
})
export default class Settings extends Vue {
  dialog = false
  datePicker = false
  loading = false
  alert = false
  modify = true

  options: Opt = {
    startEnd: false,
    onAccount: true,
    onWay: true,
  }

  @MoneyBalStore.State('options')
  public vuexOptions!: Opt

  @MoneyBalStore.Action
  public updateData!: (dateLoad: string) => Promise<boolean>

  @MoneyBalStore.Mutation
  public clearData!: () => void

  @MoneyBalStore.Mutation
  public setOptions!: (options: Opt) => void

  @RateStore.Mutation
  public clearRateData!: () => void

  //Хуки
  getVuexOptions(): void {
    this.options = { ...this.vuexOptions }
  }

  //Работа с датой
  date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10)

  get formatedDate(): string {
    const [year, month, day] = this.date.split('-')
    return `${day}/${month}/${year}`
  }

  @Watch('date')
  onDateChanged(): void {
    this.modify = true
  }

  //Загрузка данных
  async loadData(): Promise<void> {
    this.loading = true
    this.alert = false
    //
    this.clearData()
    this.clearRateData()
    this.setOptions(this.options)
    const response = await this.updateData(this.date)
    //
    this.dialog = this.alert = this.modify = response
    this.loading = false
  }

  //Настройка отображения
  changeOptions(): void {
    this.setOptions(this.options)
    this.dialog = false
  }
}
</script>
