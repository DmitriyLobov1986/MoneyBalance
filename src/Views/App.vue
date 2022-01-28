<template>
  <v-app>
    <AppBar />
    <v-main class="grey lighten-4">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
//Vue
import { Component, Vue } from 'vue-property-decorator'
import AppBar from '@/components/AppBar.vue'

@Component({
  name: 'App',
  components: {
    AppBar,
  },
})
export default class App extends Vue {}
</script>
