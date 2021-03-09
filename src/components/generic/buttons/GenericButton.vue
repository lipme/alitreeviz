<template>
   <span class="icon">
    <i :class="classButton" @click="click" :title="tooltip"></i>
  </span>
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: 'No tooltip'
    },
    icon: {
      type: String,
      default: 'mdi-information'
    },
    event: {
      type: String,
      default: 'click'
    }
  },
  computed: {
    classButton () {
      return 'mdi ' + this.icon
    }
  },
  methods: {
    click () {
      this.$emit('click', this.event)
    }
  }
}
</script>

<style></style>
