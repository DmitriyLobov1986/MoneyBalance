<template>
  <v-app-bar app flat class="grey lighten-4">
    <img class="mr-3" src="@/assets/Next_Cube.png" height="40" />
    <v-app-bar-title class="grey--text text-darken-1 font-weight-bold">
      Остатки
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <Settings />
    <v-btn class="hidden-md-and-down" @click="logout" plain small color="grey">
      Выйти
      <v-icon right>mdi-logout</v-icon>
    </v-btn>
    <!-- <component :is="compName" @login="setLogin"> </component> -->
  </v-app-bar>
</template>

<script lang="ts">
//Vue
import { Component, Vue } from 'vue-property-decorator'
import Settings from '@/components/Settings.vue'

@Component({
  name: 'AppBar',
  components: { Settings },
})
export default class AppBar extends Vue {
  logout(): void {
    this.$sessionStorage.set('login', false)
    this.$router.push('Login')
  }
}
</script>

<style></style>
