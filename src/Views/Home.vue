<template>
  <div>
    <Alert type="success" v-model="alert">
      Выручка в пути успешно подгружена!!!
    </Alert>

    <Total
      class="grey lighten-4 total"
      @select-base="selectBase"
      @select-curr="selectCurr"
    />
    <v-container fluid class="main">
      <transition-group
        name="card-move"
        appear
        tag="div"
        class="row justify-space-between"
      >
        <v-col
          sm="12"
          :lg="lgSixes(index)"
          v-for="(orgT, index) in types"
          :key="orgT"
        >
          <Cards :orgT="orgT" :currentCurr="currentCurr"> </Cards>

          <v-divider></v-divider>
        </v-col>
      </transition-group>
    </v-container>
  </div>
</template>

<script lang="ts">
//Vue
import { Component, Vue, Watch } from 'vue-property-decorator'
import Cards from '@/components/Cards.vue'
import Total from '@/components/Total.vue'
import Alert from '@/components/Alert.vue'

//Types
import { Money, OrgTypes } from '@/Types/dataTypes'

//Vuex
import { namespace } from 'vuex-class'
const MoneyOnWay = namespace('MoneyOnWay')

@Component({
  name: 'Home',
  components: {
    Cards,
    Total,
    Alert,
  },
})
export default class App extends Vue {
  types = Object.keys(OrgTypes)
  alert = ''

  lgSixes(index: number): number {
    const lines = Math.trunc(this.types.length / 3)
    const ost = this.types.length % 3

    if (index < lines * 3) {
      return 4
    } else {
      return 12 / ost
    }
  }

  selectBase(data: string[]): void {
    this.types = data.length > 0 ? data : Object.keys(OrgTypes)
  }

  currentCurr = 'RUB'
  selectCurr(data: string): void {
    this.currentCurr = data
  }

  //money on way
  @MoneyOnWay.State
  public moneyOnWay!: Money[]

  @Watch('moneyOnWay')
  onChanged(newValue: Money[]): void {
    this.alert = newValue.length > 0 ? 'main' : ''
  }
}
</script>

<style scoped>
.card-move-enter {
  opacity: 0;
  transform: translateY(-50px);
}

.card-move-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.card-move-enter-active {
  transition: opacity 0.6s ease, transform 0.5s ease;
}

.card-move-leave {
  opacity: 1;
}

.card-move-leave-to {
  opacity: 0;
}

.card-move-leave-active {
  transition: all 0.8s ease;
  position: absolute;
}

.card-move-move {
  transition: all 0.8s ease;
}

.total {
  position: fixed;
  z-index: 5;
}

.main {
  position: relative;
  top: 160px;
}
</style>
