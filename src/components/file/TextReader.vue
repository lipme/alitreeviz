<template>
  <label class="text-reader">
    {{ label }}
    <input ref="input" type="file" @change="loadTextFromFile" />
  </label>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Read file' }
  },
  methods: {
    loadTextFromFile (ev) {
      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => this.$emit('load', e.target.result)
      reader.readAsText(file)
      this.$refs.input.value = ''
    }
  }
}
</script>

<style>
.text-reader {
  /* position: relative;
  overflow: hidden;
  display: inline-block; */

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
