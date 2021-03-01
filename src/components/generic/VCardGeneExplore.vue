// Copyright 2021 [LIPM]
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
//    limitations under the License.
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
