<template>
  <v-row justify="center">
    <v-col sm="10" md="10" lg="8" class="d-flex">
      <v-autocomplete
        v-model="filtersValue"
        :items="filters[filtInd].items"
        :label="filters[filtInd].label"
        dense
        chips
        prepend-icon="mdi-database"
        multiple
        clearable
        counter
        :menu-props="{ maxHeight: 350 }"
      >
        <template v-slot:selection="{ item }">
          <v-chip color="yellow"> {{ item.text || item }} </v-chip>
        </template>
      </v-autocomplete>
      <v-btn
        @click="changeFilterType"
        class="ml-6"
        :color="isFilters ? 'red' : 'primary'"
        icon
      >
        <v-icon> mdi-filter</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
//Vue
import { Component, Vue, Prop } from 'vue-property-decorator'

//Types
import { Select } from '@/Types/selectTypes'

@Component({
  name: 'SelectField',
})
export default class SelectField extends Vue {
  @Prop() readonly filters!: Select[]

  get filtersValue(): string[] {
    return this.filters[this.filtInd].value
  }

  set filtersValue(newValue: string[]) {
    this.$emit('set-filters', { newValue, index: this.filtInd })
  }

  get isFilters(): boolean {
    for (const filter of this.filters) {
      if (filter.value.length > 0) {
        return true
      }
    }
    return false
  }

  filtInd = 0
  changeFilterType(): void {
    this.filtInd =
      this.filtInd === this.filters.length - 1 ? 0 : this.filtInd + 1
  }
}
</script>

<style scoped></style>
