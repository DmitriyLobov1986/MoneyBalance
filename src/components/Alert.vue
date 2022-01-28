<template>
  <div>
    <v-alert
      :value="value === 'add'"
      border="right"
      colored-border
      :type="type"
    >
      <slot></slot>
    </v-alert>
    <v-alert
      :value="value === 'main'"
      class="main"
      transition="scale-transition"
      shaped
      :type="type"
    >
      <slot></slot>
    </v-alert>
  </div>
</template>

<script lang="ts">
//Vue
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'Alert',
})
export default class Alert extends Vue {
  @Prop(String) readonly value!: string
  @Prop(String) readonly name!: string
  @Prop(String) readonly type!: string
  @Prop({ default: 3000 }) readonly delay!: number

  @Watch('value', { immediate: true })
  onValueChanged(): void {
    if (this.value === 'main') {
      setTimeout(() => this.$emit('input', ''), this.delay)
    }
  }
}
</script>

<style scoped>
.main {
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  width: 70%;
  margin: 0 auto;
  z-index: 5;
}
</style>
