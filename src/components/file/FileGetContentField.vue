<template>
  <div class="ma-2">
    <header>
      <slot name="header"></slot>
    </header>
    <form>
      <label>
        {{ label }}
        <text-reader :label="buttonLabel" @load="readText"></text-reader>
      </label>
    </form>
  </div>
</template>

<script>
import TextReader from './TextReader.vue'

export default {
  components: {
    TextReader
  },
  props: {
    label: { type: String, default: '' },
    buttonLabel: { type: String, default: 'Read file' }
  },
  methods: {
    readText (event) {
      this.$emit('load', event)
    }
  }
}
</script>

<style></style>
