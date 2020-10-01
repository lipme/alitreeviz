<template>
  <v-card raised>
    <v-system-bar :color="color" dark>
      {{ title }}
      <v-spacer></v-spacer>
      <show-parameters-button
        v-if="parambuttonvisible == true"
        @click="$emit('showParameters')"
      ></show-parameters-button>
      <show-help-button
        v-if="helpbuttonvisible == true"
        @click="$emit('showHelp')"
      ></show-help-button>
      <minimize-button
        v-if="minimizebuttonvisible == true"
        @click="$emit('hide')"
      ></minimize-button>
    </v-system-bar>
    <slot></slot>
  </v-card>
</template>
<script>
import MinimizeButton from '@/components/generic/buttons/MinimizeButton.vue'
import ShowParametersButton from '@/components/generic/buttons/ShowParametersButton.vue'
import ShowHelpButton from '@/components/generic/buttons/ShowHelpButton.vue'

export default {
  components: { MinimizeButton, ShowParametersButton, ShowHelpButton },
  props: {
    color: { type: String, default: 'white' },
    title: { type: String, default: '' },
    parambuttonvisible: { type: Boolean, default: true },
    minimizebuttonvisible: { type: Boolean, default: true },
    helpbuttonvisible: { type: Boolean, default: false }
  },
  data () {
    return {}
  }
}
</script>
