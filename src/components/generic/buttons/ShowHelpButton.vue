<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" @click="click">mdi-help-circle</v-icon>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: 'Help'
    }
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style></style>
