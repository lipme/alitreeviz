<template>
  <v-btn
    v-show="activeShow"
    :title="title"
    class="mr-5"
    dark
    fab
    small
    :color="color"
    @click="$emit('click')"
  >
    {{ label }}
  </v-btn>
</template>
<script>
export default {
  props: {
    label: { type: String, default: '' },
    color: { type: String, default: 'blue' },
    title: { type: String, default: '' },
    show: { type: Boolean, defaut: false }
  },
  data () {
    return {
      activeShow: this.show
    }
  },
  watch: {
    show (v) {
      this.activeShow = v
    }
  }
}
</script>
